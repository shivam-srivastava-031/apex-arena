import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { upcomingMatches, teams } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Target, Plus, Search, User, UserPlus, Calendar, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const myTeams = teams.filter((t) => t.members.some((m) => m.id === 'u1'));
  const totalWins = myTeams.reduce((a, t) => a + (t.wins ?? 0), 0);
  const totalTournaments = myTeams.reduce((a, t) => a + (t.tournamentsCount ?? 0), 0);

  const quickStats = [
    { icon: Users, label: 'Teams', value: myTeams.length, color: 'text-primary' },
    { icon: Trophy, label: 'Tournaments', value: totalTournaments, color: 'text-secondary' },
    { icon: Target, label: 'Wins', value: totalWins, color: 'text-success' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Create Team', href: '/dashboard/teams' },
    { icon: Search, label: 'Browse Tournaments', href: '/tournaments' },
    { icon: User, label: 'View Profile', href: '/dashboard/profile' },
    { icon: UserPlus, label: 'Invite Players', href: '/dashboard/teams' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Welcome */}
      <div className="gradient-hero rounded-xl p-6 md:p-8">
        <h1 className="font-display text-xl font-bold tracking-wider text-primary-foreground md:text-2xl">
          Welcome back, {user?.username}!
        </h1>
        <p className="mt-1 text-sm text-primary-foreground/70">Ready to dominate the leaderboard?</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="gaming-card flex flex-col items-center p-4 text-center md:p-6">
            <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
            <span className="font-display text-2xl font-black">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Upcoming matches */}
      <div className="gaming-card p-6">
        <h2 className="mb-4 font-display text-lg font-bold tracking-wider">UPCOMING MATCHES</h2>
        {upcomingMatches.length > 0 ? (
          <div className="space-y-3">
            {upcomingMatches.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-bold text-primary">{m.gameType}</span>
                  <div>
                    <p className="text-sm font-medium">vs {m.opponent}</p>
                    <p className="text-xs text-muted-foreground">{m.tournamentName}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(m.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming matches</p>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-display text-lg font-bold tracking-wider">QUICK ACTIONS</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((a) => (
            <Button key={a.label} asChild variant="outline" className="h-auto flex-col gap-2 py-4">
              <Link to={a.href}>
                <a.icon className="h-5 w-5 text-primary" />
                <span className="text-xs">{a.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
