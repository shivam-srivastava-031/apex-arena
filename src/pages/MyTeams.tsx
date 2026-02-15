import { useState } from 'react';
import { teams } from '@/data/mock';
import { TeamCard } from '@/components/TeamCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

const MyTeams = () => {
  const myTeams = teams.filter((t) => t.members.some((m) => m.id === 'u1'));
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = () => {
    const e: Record<string, string> = {};
    if (!teamName.trim()) e.name = 'Team name is required';
    if (!teamTag.trim()) e.tag = 'Tag is required';
    else if (teamTag.length < 2 || teamTag.length > 5) e.tag = '2-5 characters';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    toast.success(`Team "${teamName}" created!`);
    setOpen(false);
    setTeamName('');
    setTeamTag('');
    setTeamDesc('');
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
            <Button className="gradient-primary gap-2 border-0">
              <Plus className="h-4 w-4" /> Create Team
            </Button>
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
              <Button className="gradient-primary w-full border-0 font-semibold" onClick={handleCreate}>
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {myTeams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myTeams.map((t) => (
            <TeamCard key={t.id} team={t} />
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
