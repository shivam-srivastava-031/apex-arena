import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
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
    const fetchTournament = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setTournament(json.data);

          // Fetch registrations for this tournament
          const regRes = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/${id}/entries`);
          const regJson = await regRes.json();
          if (regJson.success) {
            setRegisteredTeams(regJson.data || []);

            // Check if user is registered by seeing if their team is in the registrations list
            if (user) {
              const myReg = regJson.data.find((r: any) =>
                r.teamId?.members?.some((m: any) => m.userId === user.id) || r.userId?._id === user.id
              );
              if (myReg) {
                setMyRegistration(myReg);
                setIsRegistered(true);
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id, user]);

  const handleCancelRegistration = async () => {
    // Note: Our Express API doesn't currently support user cancellation endpoint 
    // from what the swagger implies, but assuming a generic failure warning for now
    toast.error('Cancellations are not supported through the portal yet. Contact Admin.');
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
            { icon: Trophy, label: 'Prize Pool', value: `₹${Number(tournament.prizePool).toLocaleString('en-IN')}` },
            { icon: Calendar, label: 'Start Date', value: new Date(tournament.startDateTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: Calendar, label: 'Deadline', value: new Date(tournament.registrationDeadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: DollarSign, label: 'Entry Fee', value: Number(tournament.entryFee) === 0 ? 'FREE' : `₹${tournament.entryFee}` },
            { icon: Users, label: 'Teams', value: `${tournament.filledSlots}/${tournament.totalSlots}` },
          ].map((item) => (
            <div key={item.label} className="gaming-card flex flex-col items-center p-4 text-center">
              <item.icon className="mb-2 h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-display text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Register / Registered / Cancel */}
        {tournament.status === 'PUBLISHED' && isAuthenticated && (
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
              id: tournament._id,
              name: tournament.title,
              gameType: tournament.gameName,
              prizePool: Number(tournament.prizePool),
              startDate: tournament.startDateTime,
              endDate: tournament.startDateTime,
              status: tournament.status,
              registeredTeams: tournament.filledSlots,
              maxTeams: tournament.totalSlots,
              entryFee: Number(tournament.entryFee),
              description: tournament.description || '',
            }}
            open={regOpen}
            onOpenChange={setRegOpen}
            onRegistered={() => {
              setIsRegistered(true);
              // Refresh registered teams
              fetch(`${import.meta.env.VITE_API_URL}/tournaments/${id}/entries`)
                .then(res => res.json())
                .then(json => {
                  if (json.success) setRegisteredTeams(json.data || []);
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
