import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { tournaments, teams, leaderboardData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Users, DollarSign, Trophy, ArrowLeft, Swords, Target } from 'lucide-react';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  registration: 'bg-primary/15 text-primary',
  live: 'bg-destructive/15 text-destructive',
  completed: 'bg-muted text-muted-foreground',
};

const TournamentDetails = () => {
  const { id } = useParams();
  const tournament = tournaments.find((t) => t.id === id);

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

  const handleRegister = () => {
    toast.success('Registration successful! Your team has been registered.');
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-1">
          <Link to="/tournaments"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Badge className="gradient-primary border-0 text-primary-foreground">{tournament.gameType}</Badge>
            <Badge variant="outline" className={statusStyles[tournament.status]}>
              {tournament.status === 'live' ? '🔴 Live' : tournament.status === 'registration' ? 'Registration Open' : 'Completed'}
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wider md:text-4xl">{tournament.name}</h1>
        </div>

        {/* Key info cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { icon: Trophy, label: 'Prize Pool', value: `₹${tournament.prizePool.toLocaleString('en-IN')}` },
            { icon: Calendar, label: 'Start Date', value: new Date(tournament.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: Calendar, label: 'End Date', value: new Date(tournament.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: DollarSign, label: 'Entry Fee', value: tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}` },
            { icon: Users, label: 'Teams', value: `${tournament.registeredTeams}/${tournament.maxTeams}` },
          ].map((item) => (
            <div key={item.label} className="gaming-card flex flex-col items-center p-4 text-center">
              <item.icon className="mb-2 h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-display text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        {tournament.status === 'registration' && (
          <Button size="lg" className="gradient-primary mb-8 w-full border-0 font-semibold shadow-glow md:w-auto" onClick={handleRegister}>
            Register Team
          </Button>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Registered Teams</TabsTrigger>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="gaming-card p-6">
              <h3 className="mb-3 font-display text-lg font-bold">Description</h3>
              <p className="text-muted-foreground">{tournament.description}</p>
            </div>

            {tournament.rules && (
              <div className="gaming-card p-6">
                <h3 className="mb-3 font-display text-lg font-bold">Rules</h3>
                <ul className="space-y-2">
                  {tournament.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tournament.prizeDistribution && (
              <div className="gaming-card overflow-hidden p-6">
                <h3 className="mb-4 font-display text-lg font-bold">Prize Distribution</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 font-display text-xs font-bold tracking-wider text-muted-foreground">PLACE</th>
                        <th className="pb-2 font-display text-xs font-bold tracking-wider text-muted-foreground">PRIZE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.prizeDistribution.map((p) => (
                        <tr key={p.place} className="border-b border-border/50">
                          <td className="py-3 font-medium">{p.place}</td>
                          <td className="py-3 font-display font-bold text-primary">{p.prize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.slice(0, 5).map((team) => (
                <div key={team.id} className="gaming-card flex items-center gap-4 p-4">
                  <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-primary-foreground">
                    {team.tag}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold">{team.name}</h4>
                    <p className="text-xs text-muted-foreground">{team.members.length} members</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bracket">
            <div className="gaming-card flex flex-col items-center p-12 text-center">
              <Swords className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="font-display text-lg font-bold">Bracket Coming Soon</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The bracket will be generated once registration closes.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="gaming-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">RANK</th>
                      <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">TEAM</th>
                      <th className="px-4 py-3 text-right font-display text-xs font-bold tracking-wider text-muted-foreground">POINTS</th>
                      <th className="px-4 py-3 text-right font-display text-xs font-bold tracking-wider text-muted-foreground">KILLS</th>
                      <th className="px-4 py-3 text-right font-display text-xs font-bold tracking-wider text-muted-foreground">PRIZE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry) => (
                      <tr key={entry.rank} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            entry.rank <= 3 ? 'gradient-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{entry.team}</td>
                        <td className="px-4 py-3 text-right font-display font-bold">{entry.points}</td>
                        <td className="px-4 py-3 text-right">{entry.kills}</td>
                        <td className="px-4 py-3 text-right font-display font-bold text-primary">{entry.prize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TournamentDetails;
