import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchMyTeams, fetchMyRegistrations } from '@/services/api';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Trophy, Target, Plus, Search, User, UserPlus } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [teamCount, setTeamCount] = useState(0);
  const [tournamentCount, setTournamentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const teams = await fetchMyTeams();
        setTeamCount(teams.length || 0);

        const registrations = await fetchMyRegistrations();
        setTournamentCount(registrations.length || 0);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const quickStats = [
    { icon: Users, label: 'Teams', value: teamCount, color: 'text-primary' },
    { icon: Trophy, label: 'Tournaments', value: tournamentCount, color: 'text-secondary' },
    { icon: Target, label: 'Wins', value: 0, color: 'text-success' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Create Team', href: '/dashboard/teams' },
    { icon: Search, label: 'Browse Tournaments', href: '/tournaments' },
    { icon: User, label: 'View Profile', href: '/dashboard/profile' },
    { icon: UserPlus, label: 'Invite Players', href: '/dashboard/teams' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="gradient-hero rounded-xl p-6 md:p-8">
        <h1 className="font-display text-xl font-bold tracking-wider text-primary-foreground md:text-2xl">
          Welcome back, {profile?.username || user?.email}!
        </h1>
        <p className="mt-1 text-sm text-primary-foreground/70">Ready to dominate the leaderboard?</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="gaming-card flex flex-col items-center p-4 text-center md:p-6">
            <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <span className="font-display text-2xl font-black">{s.value}</span>
            )}
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

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
