import { MainLayout } from '@/components/MainLayout';
import { TournamentCard } from '@/components/TournamentCard';
import { tournaments } from '@/data/mock';
import { Trophy } from 'lucide-react';

const MyTournaments = () => {
  // Mock: show first 4 tournaments as "my" tournaments
  const myTournaments = tournaments.slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-wider">MY TOURNAMENTS</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tournaments you've registered for</p>
      </div>

      {myTournaments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
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
