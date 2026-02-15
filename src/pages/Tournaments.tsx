import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { TournamentCard } from '@/components/TournamentCard';
import { tournaments } from '@/data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { GameType, TournamentStatus } from '@/types';

const gameTypes: GameType[] = ['BGMI', 'FreeFire', 'CODMobile'];
const statuses: TournamentStatus[] = ['registration', 'live', 'completed'];
const statusLabels: Record<string, string> = {
  registration: 'Registration',
  live: 'Live',
  completed: 'Completed',
};

const Tournaments = () => {
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchGame = !selectedGame || t.gameType === selectedGame;
      const matchStatus = !selectedStatus || t.status === selectedStatus;
      return matchSearch && matchGame && matchStatus;
    });
  }, [search, selectedGame, selectedStatus]);

  const clearFilters = () => {
    setSearch('');
    setSelectedGame('');
    setSelectedStatus('');
  };

  const hasFilters = search || selectedGame || selectedStatus;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-wider md:text-4xl">TOURNAMENTS</h1>
          <p className="mt-2 text-muted-foreground">Find and join competitive tournaments</p>
        </div>

        {/* Search & filter controls */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-destructive">
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Game</label>
                <div className="flex flex-wrap gap-2">
                  {gameTypes.map((g) => (
                    <Button
                      key={g}
                      size="sm"
                      variant={selectedGame === g ? 'default' : 'outline'}
                      onClick={() => setSelectedGame(selectedGame === g ? '' : g)}
                      className={selectedGame === g ? 'gradient-primary border-0' : ''}
                    >
                      {g}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedStatus === s ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)}
                      className={selectedStatus === s ? 'gradient-primary border-0' : ''}
                    >
                      {statusLabels[s]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-bold">No tournaments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Tournaments;
