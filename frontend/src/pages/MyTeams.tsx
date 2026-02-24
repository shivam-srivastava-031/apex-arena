import { useState, useEffect } from 'react';
import { fetchMyTeams, createTeam } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MyTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchTeams = async () => {
    if (!user) return;
    try {
      const teamData = await fetchMyTeams();
      setTeams(teamData || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const handleCreate = async () => {
    const e: Record<string, string> = {};
    if (!teamName.trim()) e.name = 'Team name is required';
    if (!teamTag.trim()) e.tag = 'Tag is required';
    else if (teamTag.length < 2 || teamTag.length > 5) e.tag = '2-5 characters';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (!user) return;

    setCreating(true);
    try {
      await createTeam({
        name: teamName,
        tag: teamTag.toUpperCase(),
        description: teamDesc,
        members: [] // Leader automatically gets added on the backend
      });
      toast.success(`Team "${teamName}" created!`);
      setOpen(false);
      setTeamName('');
      setTeamTag('');
      setTeamDesc('');
      fetchTeams();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider">MY TEAMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your teams and create new ones</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2 border-0"><Plus className="h-4 w-4" /> Create Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display tracking-wider">CREATE TEAM</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Team Name</Label>
                <Input placeholder="Shadow Wolves" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="mt-1.5" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label>Team Tag (2-5 chars)</Label>
                <Input placeholder="SW" value={teamTag} onChange={(e) => setTeamTag(e.target.value.toUpperCase())} maxLength={5} className="mt-1.5" />
                {errors.tag && <p className="mt-1 text-xs text-destructive">{errors.tag}</p>}
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea placeholder="Tell us about your team..." value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} className="mt-1.5" />
              </div>
              <Button className="gradient-primary w-full border-0 font-semibold" onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating...' : 'Create Team'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : teams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team._id} className="gaming-card flex flex-col items-center p-6 text-center">
              <div className="gradient-primary mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-primary-foreground shadow-glow">
                {team.tag}
              </div>
              <h3 className="font-display text-lg font-bold tracking-wide">{team.name}</h3>
              <span className="mb-4 text-sm text-muted-foreground">[{team.tag}]</span>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/dashboard/teams/${team._id}`}>Manage</Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-display text-lg font-bold">No teams yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create your first team to get started</p>
        </div>
      )}
    </div>
  );
};

export default MyTeams;
