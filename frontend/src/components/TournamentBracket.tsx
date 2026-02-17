import { useEffect, useState } from 'react';
import { Trophy, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface BracketMatch {
  id: string;
  team1_name: string;
  team2_name: string;
  score1: number | null;
  score2: number | null;
  completed: boolean;
  winner_name: string | null;
  round_name: string;
  round_index: number;
  match_index: number;
}

interface BracketRound {
  name: string;
  matches: BracketMatch[];
}

function MatchCard({ match, animDelay }: { match: BracketMatch; animDelay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  const team1 = match.team1_name || 'TBD';
  const team2 = match.team2_name || 'TBD';

  return (
    <div
      className={`w-48 rounded-lg border transition-all duration-500 ${
        match.completed ? 'border-success/40 bg-success/5' : 'border-border bg-card'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className={`flex items-center justify-between border-b border-border/50 px-3 py-2.5 text-sm ${
        match.completed && match.winner_name === team1 ? 'font-bold text-success' : ''
      }`}>
        <span className={`truncate ${team1 === 'TBD' ? 'italic text-muted-foreground' : ''}`}>{team1}</span>
        <div className="flex items-center gap-1.5">
          {match.score1 !== null && <span className="font-display text-xs font-bold">{match.score1}</span>}
          {match.completed && match.winner_name === team1 && <CheckCircle className="h-3.5 w-3.5 text-success" />}
        </div>
      </div>
      <div className={`flex items-center justify-between px-3 py-2.5 text-sm ${
        match.completed && match.winner_name === team2 ? 'font-bold text-success' : ''
      }`}>
        <span className={`truncate ${team2 === 'TBD' ? 'italic text-muted-foreground' : ''}`}>{team2}</span>
        <div className="flex items-center gap-1.5">
          {match.score2 !== null && <span className="font-display text-xs font-bold">{match.score2}</span>}
          {match.completed && match.winner_name === team2 && <CheckCircle className="h-3.5 w-3.5 text-success" />}
        </div>
      </div>
    </div>
  );
}

export function TournamentBracket({ tournamentId }: { tournamentId: string }) {
  const [rounds, setRounds] = useState<BracketRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [champion, setChampion] = useState<string | null>(null);

  const fetchBracket = async () => {
    const { data } = await supabase
      .from('bracket_matches')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('round_index', { ascending: true })
      .order('match_index', { ascending: true });

    if (data && data.length > 0) {
      const roundMap = new Map<string, BracketMatch[]>();
      const roundOrder: string[] = [];
      
      data.forEach(m => {
        if (!roundMap.has(m.round_name)) {
          roundMap.set(m.round_name, []);
          roundOrder.push(m.round_name);
        }
        roundMap.get(m.round_name)!.push(m as BracketMatch);
      });

      const bracketRounds: BracketRound[] = roundOrder.map(name => ({
        name,
        matches: roundMap.get(name)!,
      }));

      setRounds(bracketRounds);

      // Check for champion (winner of the last round's match)
      const lastRound = bracketRounds[bracketRounds.length - 1];
      if (lastRound?.matches[0]?.completed && lastRound.matches[0].winner_name) {
        setChampion(lastRound.matches[0].winner_name);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBracket();

    // Subscribe to realtime bracket updates
    const channel = supabase
      .channel(`bracket-${tournamentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bracket_matches',
        filter: `tournament_id=eq.${tournamentId}`,
      }, () => {
        fetchBracket();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex gap-8 py-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col gap-6">
            <Skeleton className="h-6 w-24" />
            {[1, 2].map(j => <Skeleton key={j} className="h-20 w-48" />)}
          </div>
        ))}
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Trophy className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Bracket not yet available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-[700px] items-center gap-8 py-4">
        {rounds.map((round, ri) => (
          <div key={round.name} className="flex flex-col items-center gap-2">
            <h4 className="mb-3 font-display text-xs font-bold tracking-wider text-muted-foreground">
              {round.name.toUpperCase()}
            </h4>
            <div className="flex flex-col justify-around gap-6" style={{ minHeight: ri === 0 ? undefined : `${rounds[0].matches.length * 80}px` }}>
              {round.matches.map((match, mi) => (
                <MatchCard key={match.id} match={match} animDelay={ri * 300 + mi * 100} />
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center gap-2">
          <h4 className="mb-3 font-display text-xs font-bold tracking-wider text-primary">CHAMPION</h4>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <span className="text-xs italic text-muted-foreground">{champion || 'TBD'}</span>
        </div>
      </div>
    </div>
  );
}
