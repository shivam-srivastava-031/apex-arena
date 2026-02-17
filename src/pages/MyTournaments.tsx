import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TournamentCard } from '@/components/TournamentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';

const MyTournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: regs } = await supabase
        .from('registrations')
        .select('tournament_id, tournaments(*)')
        .eq('registered_by', user.id)
        .eq('status', 'registered');
      
      const tourns = (regs || []).map(r => r.tournaments).filter(Boolean);
      setTournaments(tourns);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const mapTournament = (t: any) => ({
    id: t.id,
    name: t.name,
    gameType: t.game_type,
    prizePool: Number(t.prize_pool),
    startDate: t.start_date,
    endDate: t.end_date,
    status: t.status,
    registeredTeams: t.registered_teams,
    maxTeams: t.max_teams,
    entryFee: Number(t.entry_fee),
    description: t.description || '',
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-wider">MY TOURNAMENTS</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tournaments you've registered for</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : tournaments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={mapTournament(t)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <Trophy className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-display text-lg font-bold">No tournaments yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Browse tournaments and register your team</p>
        </div>
      )}
    </div>
  );
};

export default MyTournaments;
