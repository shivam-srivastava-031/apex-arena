import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TournamentProp {
  id: string;
  name: string;
  gameType: string;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: string;
  registeredTeams: number;
  maxTeams: number;
  entryFee: number;
  description: string;
}

interface Props {
  tournament: TournamentProp;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegistered: () => void;
}

export function RegistrationModal({ tournament, open, onOpenChange, onRegistered }: Props) {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [teamMemberCounts, setTeamMemberCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user || !open) return;
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('id, name, tag')
        .eq('captain_id', user.id);
      setMyTeams(data || []);

      // Fetch member counts
      if (data && data.length > 0) {
        const counts: Record<string, number> = {};
        for (const team of data) {
          const { count } = await supabase
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id);
          counts[team.id] = (count || 0) + 1; // +1 for captain
        }
        setTeamMemberCounts(counts);
      }
    };
    fetchTeams();
  }, [user, open]);

  const memberCount = teamMemberCounts[selectedTeam] || 0;
  const isEligible = memberCount >= 3;

  const handleRegister = async () => {
    if (!selectedTeam || !rulesAccepted || !user) return;
    if (!isEligible) {
      toast.error('Team needs at least 3 members to register.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('registrations').insert({
      tournament_id: tournament.id,
      team_id: selectedTeam,
      registered_by: user.id,
    });
    setLoading(false);
    
    if (error) {
      if (error.code === '23505') {
        toast.error('This team is already registered for this tournament.');
      } else {
        toast.error(error.message || 'Registration failed');
      }
      return;
    }

    const teamData = myTeams.find(t => t.id === selectedTeam);
    toast.success(`${teamData?.name} registered for ${tournament.name}!`);
    onRegistered();
    onOpenChange(false);
    setSelectedTeam('');
    setRulesAccepted(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">REGISTER TEAM</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="mb-1 font-display text-sm font-bold">{tournament.name}</h4>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Prize: ₹{tournament.prizePool.toLocaleString('en-IN')}</span>
              <span>Teams: {tournament.registeredTeams}/{tournament.maxTeams}</span>
            </div>
          </div>

          <div>
            <Label>Select Team</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Choose a team..." />
              </SelectTrigger>
              <SelectContent>
                {myTeams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    [{t.tag}] {t.name} ({teamMemberCounts[t.id] || 1} members)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {myTeams.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">You don't have any teams. Create one first.</p>
            )}
          </div>

          {selectedTeam && (
            <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
              isEligible ? 'border-success/30 bg-success/5 text-success' : 'border-destructive/30 bg-destructive/5 text-destructive'
            }`}>
              {isEligible ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{isEligible ? 'Team meets eligibility requirements!' : 'Team needs at least 3 members to register.'}</span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm text-muted-foreground">Entry Fee</span>
            <span className="font-display font-bold">
              {tournament.entryFee === 0 ? <span className="text-success">FREE</span> : `₹${tournament.entryFee}`}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="rules" checked={rulesAccepted} onCheckedChange={(v) => setRulesAccepted(v as boolean)} className="mt-0.5" />
            <Label htmlFor="rules" className="text-sm leading-relaxed">
              I acknowledge the tournament rules and agree to abide by them
            </Label>
          </div>

          <Button
            className="gradient-primary w-full border-0 font-semibold"
            disabled={!selectedTeam || !rulesAccepted || !isEligible || loading}
            onClick={handleRegister}
          >
            {loading ? 'Registering...' : 'Confirm Registration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
