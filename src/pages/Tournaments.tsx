import { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { TournamentCard } from '@/components/TournamentCard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

type GameType = 'BGMI' | 'FreeFire' | 'CODMobile';
type TournamentStatus = 'registration' | 'live' | 'completed';

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
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);
  const isSearching = search !== debouncedSearch;

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });
      if (data) setTournaments(data);
      setLoading(false);
    };
    fetchTournaments();

    // Subscribe to realtime
    const channel = supabase
      .channel('tournaments-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, () => {
        fetchTournaments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = t.name.toLowerCase().includes(q) || t.game_type.toLowerCase().includes(q);
      const matchGame = !selectedGame || t.game_type === selectedGame;
      const matchStatus = !selectedStatus || t.status === selectedStatus;
      return matchSearch && matchGame && matchStatus;
    });
  }, [debouncedSearch, selectedGame, selectedStatus, tournaments]);

  const clearFilters = () => {
    setSearch('');
    setSelectedGame('');
    setSelectedStatus('');
  };

  const hasFilters = search || selectedGame || selectedStatus;

  // Map DB fields to component props
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
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-bold tracking-wider md:text-4xl">TOURNAMENTS</h1>
          <p className="mt-2 text-muted-foreground">Find and join competitive tournaments</p>
        </div>

        {/* Search & filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by tournament name or game type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-destructive">
              <X className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Game</label>
                <div className="flex flex-wrap gap-2">
                  {gameTypes.map((g) => (
                    <Button key={g} size="sm" variant={selectedGame === g ? 'default' : 'outline'} onClick={() => setSelectedGame(selectedGame === g ? '' : g)} className={selectedGame === g ? 'gradient-primary border-0' : ''}>
                      {g}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <Button key={s} size="sm" variant={selectedStatus === s ? 'default' : 'outline'} onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)} className={selectedStatus === s ? 'gradient-primary border-0' : ''}>
                      {statusLabels[s]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : isSearching ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Searching...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t, i) => (
              <div key={t.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <TournamentCard tournament={mapTournament(t)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-bold">No results found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Tournaments;
