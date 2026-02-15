import { tournaments, teams } from '@/data/mock';
import { Users, Trophy, UserPlus, Calendar } from 'lucide-react';

const recentRegistrations = [
  { team: 'Shadow Wolves', tournament: 'BGMI Pro League Season 4', date: '2026-02-14' },
  { team: 'Phoenix Rising', tournament: 'Free Fire Rampage Series', date: '2026-02-13' },
  { team: 'Nova Blitz', tournament: 'COD Mobile Weekend Warriors', date: '2026-02-12' },
  { team: 'Omega Squad', tournament: 'BGMI Rising Stars', date: '2026-02-11' },
  { team: 'Titan Esports', tournament: 'BGMI Grand Masters Invitational', date: '2026-02-10' },
];

const AdminDashboard = () => {
  const statsCards = [
    { icon: Users, label: 'Total Users', value: '2,847', color: 'text-primary' },
    { icon: Trophy, label: 'Total Tournaments', value: tournaments.length.toString(), color: 'text-secondary' },
    { icon: UserPlus, label: 'Total Teams', value: teams.length.toString(), color: 'text-success' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-wider">ADMIN DASHBOARD</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {statsCards.map((s) => (
          <div key={s.label} className="gaming-card flex flex-col items-center p-6 text-center">
            <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
            <span className="font-display text-2xl font-black">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
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
              {recentRegistrations.map((r, i) => (
                <tr key={i} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{r.team}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.tournament}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
