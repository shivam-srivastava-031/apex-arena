import { useState } from 'react';
import { teams } from '@/data/mock';
import { Tournament } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegistered: () => void;
}

export function RegistrationModal({ tournament, open, onOpenChange, onRegistered }: Props) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const myTeams = teams.filter((t) => t.members.some((m) => m.id === 'u1'));

  const selectedTeamData = myTeams.find((t) => t.id === selectedTeam);
  const isEligible = selectedTeamData ? selectedTeamData.members.length >= 3 : false;

  const handleRegister = async () => {
    if (!selectedTeam || !rulesAccepted) return;
    if (!isEligible) {
      toast.error('Team needs at least 3 members to register.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success(`${selectedTeamData?.name} registered for ${tournament.name}!`);
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
          {/* Tournament Info */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="mb-1 font-display text-sm font-bold">{tournament.name}</h4>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Prize: ₹{tournament.prizePool.toLocaleString('en-IN')}</span>
              <span>Teams: {tournament.registeredTeams}/{tournament.maxTeams}</span>
            </div>
          </div>

          {/* Team Select */}
          <div>
            <Label>Select Team</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Choose a team..." />
              </SelectTrigger>
              <SelectContent>
                {myTeams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    [{t.tag}] {t.name} ({t.members.length} members)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Eligibility */}
          {selectedTeam && (
            <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
              isEligible
                ? 'border-success/30 bg-success/5 text-success'
                : 'border-destructive/30 bg-destructive/5 text-destructive'
            }`}>
              {isEligible ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>
                {isEligible
                  ? 'Team meets eligibility requirements!'
                  : 'Team needs at least 3 members to register.'}
              </span>
            </div>
          )}

          {/* Entry Fee */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm text-muted-foreground">Entry Fee</span>
            <span className="font-display font-bold">
              {tournament.entryFee === 0 ? (
                <span className="text-success">FREE</span>
              ) : (
                `₹${tournament.entryFee}`
              )}
            </span>
          </div>

          {/* Rules */}
          <div className="flex items-start gap-2">
            <Checkbox
              id="rules"
              checked={rulesAccepted}
              onCheckedChange={(v) => setRulesAccepted(v as boolean)}
              className="mt-0.5"
            />
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
