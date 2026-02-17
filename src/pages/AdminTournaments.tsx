import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  registration: 'bg-primary/15 text-primary',
  live: 'bg-destructive/15 text-destructive',
  completed: 'bg-muted text-muted-foreground',
};

type GameType = 'BGMI' | 'FreeFire' | 'CODMobile';

const AdminTournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [gameType, setGameType] = useState<GameType>('BGMI');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [maxTeams, setMaxTeams] = useState('');
  const [entryFee, setEntryFee] = useState('');

  const fetchTournaments = async () => {
    const { data } = await supabase.from('tournaments').select('*').order('created_at', { ascending: false });
    setTournaments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleCreate = async () => {
    if (!name || !startDate || !endDate || !prizePool || !maxTeams) {
      toast.error('Please fill all required fields.');
      return;
    }
    setCreating(true);
    const { error } = await supabase.from('tournaments').insert({
      name,
      game_type: gameType,
      description,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      prize_pool: Number(prizePool),
      max_teams: Number(maxTeams),
      entry_fee: Number(entryFee) || 0,
      created_by: user?.id,
    });
    setCreating(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Tournament "${name}" created!`);
    setCreateOpen(false);
    setName(''); setDescription(''); setStartDate(''); setEndDate(''); setPrizePool(''); setMaxTeams(''); setEntryFee('');
    fetchTournaments();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Tournament deleted.');
    fetchTournaments();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-wider">MANAGE TOURNAMENTS</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2 border-0"><Plus className="h-4 w-4" /> Create Tournament</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wider">CREATE TOURNAMENT</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tournament name" className="mt-1.5" />
              </div>
              <div>
                <Label>Game Type</Label>
                <Select value={gameType} onValueChange={(v) => setGameType(v as GameType)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BGMI">BGMI</SelectItem>
                    <SelectItem value="FreeFire">Free Fire</SelectItem>
                    <SelectItem value="CODMobile">COD Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tournament description..." className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Date *</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5" /></div>
                <div><Label>End Date *</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1.5" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Prize Pool *</Label><Input type="number" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} placeholder="₹" className="mt-1.5" /></div>
                <div><Label>Max Teams *</Label><Input type="number" value={maxTeams} onChange={(e) => setMaxTeams(e.target.value)} placeholder="64" className="mt-1.5" /></div>
                <div><Label>Entry Fee</Label><Input type="number" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} placeholder="0" className="mt-1.5" /></div>
              </div>
              <Button className="gradient-primary w-full border-0 font-semibold" onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating...' : 'Create Tournament'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="gaming-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">NAME</th>
                <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">GAME</th>
                <th className="px-4 py-3 text-left font-display text-xs font-bold tracking-wider text-muted-foreground">STATUS</th>
                <th className="px-4 py-3 text-right font-display text-xs font-bold tracking-wider text-muted-foreground">PRIZE</th>
                <th className="px-4 py-3 text-right font-display text-xs font-bold tracking-wider text-muted-foreground">TEAMS</th>
                <th className="px-4 py-3 text-right font-display text-xs font-bold tracking-wider text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-border/50">
                    {[1, 2, 3, 4, 5, 6].map(j => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : tournaments.length > 0 ? (
                tournaments.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{t.game_type}</Badge></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-display font-bold">₹{Number(t.prize_pool).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">{t.registered_teams}/{t.max_teams}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No tournaments yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTournaments;
