import { useParams, Link } from 'react-router-dom';
import { fetchTeamById, addTeamMember, removeTeamMember } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, UserPlus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const TeamDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteBgmiId, setInviteBgmiId] = useState('');

  const fetchTeam = async () => {
    try {
      const teamData = await fetchTeamById(id as string);
      setTeam(teamData);
      setMembers(teamData.members || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div><Skeleton className="h-8 w-48" /><Skeleton className="mt-2 h-4 w-32" /></div>
        </div>
      </div>
    );
  }

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

  const isCaptain = team.leaderId._id === user?.id || team.leaderId === user?.id;

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteBgmiId.trim()) {
      toast.error('Name and BGMI ID are required');
      return;
    }

    try {
      await addTeamMember(team._id, { name: inviteName, bgmiId: inviteBgmiId });
      toast.success(`${inviteName} added to team!`);
      setInviteOpen(false);
      setInviteName('');
      setInviteBgmiId('');
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member');
    }
  };

  const handleRemove = async (memberId: string, name: string) => {
    try {
      await removeTeamMember(team._id, memberId);
      toast.success(`${name} removed from team.`);
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-1">
        <Link to="/dashboard/teams"><ArrowLeft className="h-4 w-4" /> Back to Teams</Link>
      </Button>

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
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary gap-2 border-0"><UserPlus className="h-4 w-4" /> Add Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display tracking-wider">ADD MEMBER</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Player Name</Label>
                  <Input placeholder="Enter name..." value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Player BGMI ID</Label>
                  <Input placeholder="Enter BGMI ID..." value={inviteBgmiId} onChange={(e) => setInviteBgmiId(e.target.value)} className="mt-1.5" />
                </div>
                <Button className="gradient-primary w-full border-0" onClick={handleInvite}>Add to Team</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 w-full justify-start bg-muted/50">
          <TabsTrigger value="overview">Members ({members.length + 1})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="gaming-card p-6">
            <h3 className="mb-4 font-display text-lg font-bold tracking-wider">MEMBERS</h3>
            <div className="space-y-3">
              {/* Captain */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-xs">CP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Captain</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      Captain
                    </p>
                  </div>
                </div>
              </div>
              {members.map((m) => (
                <div key={m._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-xs">
                        {(m.name || 'U').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        Member
                      </p>
                    </div>
                  </div>
                  {isCaptain && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(m._id, m.name)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamDetailsPage;
