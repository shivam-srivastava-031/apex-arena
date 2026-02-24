import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchMyRegistrations } from '@/services/api';
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
      try {
        const regs = await fetchMyRegistrations();
        const tourns = (regs || []).map((r: any) => r.tournamentId).filter(Boolean);
        setTournaments(tourns);
      } catch (error) {
        console.error('Failed to fetch my tournaments', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const mapTournament = (t: any) => ({
    id: t._id || t.id,
    name: t.title || t.name,
    gameType: t.gameName || t.gameType || t.game_type,
    prizePool: Number(t.prizePool || t.prize_pool || 0),
    startDate: t.startDateTime || t.startDate || t.start_date,
    endDate: t.endDate || t.end_date,
    status: t.status,
    registeredTeams: t.filledSlots || t.registeredTeams || t.registered_teams || 0,
    maxTeams: t.totalSlots || t.maxTeams || t.max_teams || 0,
    entryFee: Number(t.entryFee || t.entry_fee || 0),
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
