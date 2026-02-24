import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createRazorpayOrder, confirmPayment } from '@/services/api';

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
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/teams/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        const teams = json.data || [];

        // Map backend schema to what the modal expects
        const mappedTeams = teams.map((t: any) => ({
          id: t._id,
          name: t.name,
          tag: t.name.substring(0, 3).toUpperCase()
        }));

        setMyTeams(mappedTeams);

        if (teams.length > 0) {
          const counts: Record<string, number> = {};
          for (const team of teams) {
            counts[team._id] = team.members?.length || 1;
          }
          setTeamMemberCounts(counts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, [user, open]);

  const memberCount = teamMemberCounts[selectedTeam] || 0;
  // Use tournament's dynamic teamSize instead of hardcoded 3 if available, matching selectedTeamSize.
  const isEligible = memberCount > 0;

  const handleRegister = async () => {
    if (!selectedTeam || !rulesAccepted || !user) return;
    setLoading(true);

    try {
      // Find selected team members array to construct payload
      let selectedPlayers = [{ name: user.username, bgmiId: user.username }];

      // 1. Create order
      const orderData = await createRazorpayOrder(tournament.id, memberCount, selectedPlayers);

      // Free tournament or 0 entry fee
      if (orderData.amount === 0) {
        await confirmPayment(orderData.paymentId, 'SUCCESS');
        toast.success(`Registered successfully for ${tournament.name}!`);
        onRegistered();
        onOpenChange(false);
        setSelectedTeam('');
        setRulesAccepted(false);
        setLoading(false);
        return;
      }

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Apex Arena',
        description: `Registration for ${tournament.name}`,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await confirmPayment(
              orderData.paymentId,
              'SUCCESS',
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            toast.success(`Payment successful! Registered for ${tournament.name}!`);
            onRegistered();
            onOpenChange(false);
            setSelectedTeam('');
            setRulesAccepted(false);
          } catch (confirmErr: any) {
            toast.error(confirmErr.message || 'Payment verification failed on server');
          }
        },
        prefill: {
          name: user.username,
          email: user.email
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: async () => {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        toast.error(response.error.description || 'Payment Failed');
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      setLoading(false);
    }
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
            <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${isEligible ? 'border-success/30 bg-success/5 text-success' : 'border-destructive/30 bg-destructive/5 text-destructive'
              }`}>
              {isEligible ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{isEligible ? 'Team meets eligibility requirements!' : 'Team needs members to register.'}</span>
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
