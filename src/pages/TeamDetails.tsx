import { useParams, Link } from 'react-router-dom';
import { teams, tournaments } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, UserPlus, Trophy, Target, DollarSign, Crown, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const TeamDetailsPage = () => {
  const { id } = useParams();
  const team = teams.find((t) => t.id === id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');

  if (!team) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <h2 className="font-display text-xl font-bold">Team not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/dashboard/teams">← Back to Teams</Link>
        </Button>
      </div>
    );
  }

  const isCaptain = team.captainId === 'u1';

  const handleInvite = () => {
    if (!inviteUsername.trim()) return;
    toast.success(`Invite sent to ${inviteUsername}!`);
    setInviteOpen(false);
    setInviteUsername('');
  };

  const handleRemove = (username: string) => {
    toast.success(`${username} removed from team.`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-1">
        <Link to="/dashboard/teams"><ArrowLeft className="h-4 w-4" /> Back to Teams</Link>
      </Button>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <div className="gradient-primary flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-primary-foreground shadow-glow">
          {team.tag}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-wider">{team.name}</h1>
            <span className="text-sm text-muted-foreground">[{team.tag}]</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Created {new Date(team.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
        {isCaptain && (
          <div className="flex gap-2">
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary gap-2 border-0">
                  <UserPlus className="h-4 w-4" /> Invite Player
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display tracking-wider">INVITE PLAYER</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Username</Label>
                    <Input placeholder="Search username..." value={inviteUsername} onChange={(e) => setInviteUsername(e.target.value)} className="mt-1.5" />
                  </div>
                  <Button className="gradient-primary w-full border-0" onClick={handleInvite}>Send Invite</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 w-full justify-start bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="gaming-card p-6">
            <h3 className="mb-4 font-display text-lg font-bold tracking-wider">MEMBERS</h3>
            <div className="space-y-3">
              {team.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted">{m.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{m.username}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        {m.role === 'captain' && <Crown className="h-3 w-3 text-warning" />}
                        {m.role === 'captain' ? 'Captain' : 'Member'}
                      </p>
                    </div>
                  </div>
                  {isCaptain && m.role !== 'captain' && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(m.username)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tournaments">
          <div className="grid gap-4 md:grid-cols-2">
            {tournaments.slice(0, 3).map((t) => (
              <Link key={t.id} to={`/tournaments/${t.id}`} className="gaming-card flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">{t.gameType}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">₹{t.prizePool.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Trophy, label: 'Total Wins', value: team.wins ?? 0 },
              { icon: Target, label: 'Total Kills', value: 342 },
              { icon: DollarSign, label: 'Prize Won', value: '₹1.2L' },
            ].map((s) => (
              <div key={s.label} className="gaming-card flex flex-col items-center p-6 text-center">
                <s.icon className="mb-2 h-6 w-6 text-primary" />
                <span className="font-display text-2xl font-black">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamDetailsPage;
