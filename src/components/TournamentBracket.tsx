import { useEffect, useState } from 'react';
import { Trophy, CheckCircle } from 'lucide-react';

interface BracketMatch {
  id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  completed: boolean;
  winner?: string;
}

interface BracketRound {
  name: string;
  matches: BracketMatch[];
}

const bracketData: BracketRound[] = [
  {
    name: 'Quarter Finals',
    matches: [
      { id: 'qf1', team1: 'Shadow Wolves', team2: 'Cyber Ninjas', score1: 3, score2: 1, completed: true, winner: 'Shadow Wolves' },
      { id: 'qf2', team1: 'Titan Esports', team2: 'Apex Legends', score1: 3, score2: 2, completed: true, winner: 'Titan Esports' },
      { id: 'qf3', team1: 'Nova Blitz', team2: 'Dark Knights', score1: 3, score2: 0, completed: true, winner: 'Nova Blitz' },
      { id: 'qf4', team1: 'Phoenix Rising', team2: 'Omega Squad', score1: 2, score2: 3, completed: true, winner: 'Omega Squad' },
    ],
  },
  {
    name: 'Semi Finals',
    matches: [
      { id: 'sf1', team1: 'Shadow Wolves', team2: 'Titan Esports', score1: 3, score2: 2, completed: true, winner: 'Shadow Wolves' },
      { id: 'sf2', team1: 'Nova Blitz', team2: 'Omega Squad', completed: false },
    ],
  },
  {
    name: 'Finals',
    matches: [
      { id: 'f1', team1: 'TBD', team2: 'TBD', completed: false },
    ],
  },
];

function MatchCard({ match, animDelay }: { match: BracketMatch; animDelay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  return (
    <div
      className={`w-48 rounded-lg border transition-all duration-500 ${
        match.completed
          ? 'border-success/40 bg-success/5'
          : 'border-border bg-card'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Team 1 */}
      <div className={`flex items-center justify-between border-b border-border/50 px-3 py-2.5 text-sm ${
        match.completed && match.winner === match.team1 ? 'font-bold text-success' : ''
      }`}>
        <span className={`truncate ${match.team1 === 'TBD' ? 'italic text-muted-foreground' : ''}`}>
          {match.team1}
        </span>
        <div className="flex items-center gap-1.5">
          {match.score1 !== undefined && (
            <span className="font-display text-xs font-bold">{match.score1}</span>
          )}
          {match.completed && match.winner === match.team1 && (
            <CheckCircle className="h-3.5 w-3.5 text-success" />
          )}
        </div>
      </div>
      {/* Team 2 */}
      <div className={`flex items-center justify-between px-3 py-2.5 text-sm ${
        match.completed && match.winner === match.team2 ? 'font-bold text-success' : ''
      }`}>
        <span className={`truncate ${match.team2 === 'TBD' ? 'italic text-muted-foreground' : ''}`}>
          {match.team2}
        </span>
        <div className="flex items-center gap-1.5">
          {match.score2 !== undefined && (
            <span className="font-display text-xs font-bold">{match.score2}</span>
          )}
          {match.completed && match.winner === match.team2 && (
            <CheckCircle className="h-3.5 w-3.5 text-success" />
          )}
        </div>
      </div>
    </div>
  );
}

export function TournamentBracket() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-[700px] items-center gap-8 py-4">
        {bracketData.map((round, ri) => (
          <div key={round.name} className="flex flex-col items-center gap-2">
            <h4 className="mb-3 font-display text-xs font-bold tracking-wider text-muted-foreground">
              {round.name.toUpperCase()}
            </h4>
            <div className="flex flex-col justify-around gap-6" style={{ minHeight: ri === 0 ? undefined : `${bracketData[0].matches.length * 80}px` }}>
              {round.matches.map((match, mi) => (
                <MatchCard key={match.id} match={match} animDelay={ri * 300 + mi * 100} />
              ))}
            </div>
          </div>
        ))}

        {/* Champion */}
        <div className="flex flex-col items-center gap-2">
          <h4 className="mb-3 font-display text-xs font-bold tracking-wider text-primary">CHAMPION</h4>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <span className="text-xs italic text-muted-foreground">TBD</span>
        </div>
      </div>
    </div>
  );
}
