import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, DollarSign, Trophy, ArrowLeft, Target, CheckCircle, Loader2 } from 'lucide-react';
import { TournamentBracket } from '@/components/TournamentBracket';
import { RegistrationModal } from '@/components/RegistrationModal';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  registration: 'bg-primary/15 text-primary',
  live: 'bg-destructive/15 text-destructive',
  completed: 'bg-muted text-muted-foreground',
};

const TournamentDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regOpen, setRegOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [myRegistration, setMyRegistration] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setTournament(data);

      // Fetch registered teams
      if (data) {
        const { data: regs } = await supabase
          .from('registrations')
          .select('*, teams(id, name, tag)')
          .eq('tournament_id', data.id)
          .eq('status', 'registered');
        setRegisteredTeams(regs || []);

        // Check if user's team is registered
        if (user) {
          const { data: myReg } = await supabase
            .from('registrations')
            .select('*, teams(id, name, tag)')
            .eq('tournament_id', data.id)
            .eq('registered_by', user.id)
            .eq('status', 'registered')
            .maybeSingle();
          setMyRegistration(myReg);
          setIsRegistered(!!myReg);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleCancelRegistration = async () => {
    if (!myRegistration) return;
    const { error } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', myRegistration.id);
    if (error) {
      toast.error('Failed to cancel registration');
    } else {
      toast.success('Registration cancelled');
      setIsRegistered(false);
      setMyRegistration(null);
      setRegisteredTeams(prev => prev.filter(r => r.id !== myRegistration.id));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="mb-4 h-8 w-32" />
          <Skeleton className="mb-6 h-12 w-96" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!tournament) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center py-20 text-center">
          <h2 className="font-display text-xl font-bold">Tournament not found</h2>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/tournaments">← Back to Tournaments</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-1">
          <Link to="/tournaments"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Badge className="gradient-primary border-0 text-primary-foreground">{tournament.game_type}</Badge>
            <Badge variant="outline" className={statusStyles[tournament.status]}>
              {tournament.status === 'live' ? '🔴 Live' : tournament.status === 'registration' ? 'Registration Open' : 'Completed'}
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wider md:text-4xl">{tournament.name}</h1>
        </div>

        {/* Key info cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { icon: Trophy, label: 'Prize Pool', value: `₹${Number(tournament.prize_pool).toLocaleString('en-IN')}` },
            { icon: Calendar, label: 'Start Date', value: new Date(tournament.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: Calendar, label: 'End Date', value: new Date(tournament.end_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: DollarSign, label: 'Entry Fee', value: Number(tournament.entry_fee) === 0 ? 'FREE' : `₹${tournament.entry_fee}` },
            { icon: Users, label: 'Teams', value: `${tournament.registered_teams}/${tournament.max_teams}` },
          ].map((item) => (
            <div key={item.label} className="gaming-card flex flex-col items-center p-4 text-center">
              <item.icon className="mb-2 h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-display text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Register / Registered / Cancel */}
        {tournament.status === 'registration' && isAuthenticated && (
          <div className="mb-8 flex flex-wrap gap-3">
            {isRegistered ? (
              <>
                <Button size="lg" disabled className="gap-2 bg-success/20 text-success">
                  <CheckCircle className="h-4 w-4" /> Registered
                </Button>
                <Button size="lg" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleCancelRegistration}>
                  Cancel Registration
                </Button>
              </>
            ) : (
              <Button size="lg" className="gradient-primary border-0 font-semibold shadow-glow md:w-auto" onClick={() => setRegOpen(true)}>
                Register Team
              </Button>
            )}
          </div>
        )}

        {isAuthenticated && (
          <RegistrationModal
            tournament={{
              id: tournament.id,
              name: tournament.name,
              gameType: tournament.game_type,
              prizePool: Number(tournament.prize_pool),
              startDate: tournament.start_date,
              endDate: tournament.end_date,
              status: tournament.status,
              registeredTeams: tournament.registered_teams,
              maxTeams: tournament.max_teams,
              entryFee: Number(tournament.entry_fee),
              description: tournament.description || '',
            }}
            open={regOpen}
            onOpenChange={setRegOpen}
            onRegistered={() => {
              setIsRegistered(true);
              // Refresh registered teams
              supabase.from('registrations').select('*, teams(id, name, tag)').eq('tournament_id', tournament.id).eq('status', 'registered').then(({ data }) => {
                setRegisteredTeams(data || []);
              });
            }}
          />
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Registered Teams ({registeredTeams.length})</TabsTrigger>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="gaming-card p-6">
              <h3 className="mb-3 font-display text-lg font-bold">Description</h3>
              <p className="text-muted-foreground">{tournament.description || 'No description available.'}</p>
            </div>
            {tournament.rules && (
              <div className="gaming-card p-6">
                <h3 className="mb-3 font-display text-lg font-bold">Rules</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{tournament.rules}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams">
            {registeredTeams.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {registeredTeams.map((reg) => (
                  <div key={reg.id} className="gaming-card flex items-center gap-4 p-4">
                    <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-primary-foreground">
                      {reg.teams?.tag || '??'}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold">{reg.teams?.name || 'Unknown Team'}</h4>
                      <p className="text-xs text-muted-foreground">Registered {new Date(reg.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No teams registered yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bracket">
            <TournamentBracket tournamentId={tournament.id} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TournamentDetails;
