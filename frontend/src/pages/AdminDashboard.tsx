import { useEffect, useState } from 'react';
import { Users, Trophy, UserPlus, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, tournaments: 0, teams: 0 });
  const [recentRegs, setRecentRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [{ count: userCount }, { count: tournamentCount }, { count: teamCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('tournaments').select('*', { count: 'exact', head: true }),
        supabase.from('teams').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        users: userCount || 0,
        tournaments: tournamentCount || 0,
        teams: teamCount || 0,
      });

      const { data: regs } = await supabase
        .from('registrations')
        .select('*, teams(name), tournaments(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentRegs(regs || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const statsCards = [
    { icon: Users, label: 'Total Users', value: stats.users.toString(), color: 'text-primary' },
    { icon: Trophy, label: 'Total Tournaments', value: stats.tournaments.toString(), color: 'text-secondary' },
    { icon: UserPlus, label: 'Total Teams', value: stats.teams.toString(), color: 'text-success' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-wider">ADMIN DASHBOARD</h1>

      <div className="grid grid-cols-3 gap-4">
        {statsCards.map((s) => (
          <div key={s.label} className="gaming-card flex flex-col items-center p-6 text-center">
            <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
            {loading ? <Skeleton className="h-8 w-12" /> : <span className="font-display text-2xl font-black">{s.value}</span>}
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="gaming-card overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-lg font-bold tracking-wider">RECENT REGISTRATIONS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">TEAM</th>
                <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">TOURNAMENT</th>
                <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">DATE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : recentRegs.length > 0 ? (
                recentRegs.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{r.teams?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.tournaments?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No registrations yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
