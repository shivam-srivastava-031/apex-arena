import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

interface TeamMember {
  name: string;
  bgmiId: string;
}

interface Team {
  id: string;
  name: string;
  tag: string;
  members: TeamMember[];
}

interface Props {
  tournament: TournamentProp;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegistered: () => void;
}

export function RegistrationModal({ tournament, open, onOpenChange, onRegistered }: Props) {
  const { user } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingTeams, setFetchingTeams] = useState(false);
  const [myTeams, setMyTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!user || !open) return;
    const fetchTeams = async () => {
      setFetchingTeams(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/teams/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        const teams = json.data || [];

        const mappedTeams: Team[] = teams.map((t: any) => ({
          id: t._id,
          name: t.name,
          tag: (t.tag || t.name.substring(0, 3)).toUpperCase(),
          // Map backend member schema → { name, bgmiId }
          members: (t.members || []).map((m: any) => ({
            name: m.name || m.username || user.username,
            bgmiId: m.bgmiId || m.username || user.username,
          }))
        }));

        setMyTeams(mappedTeams);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load your teams');
      } finally {
        setFetchingTeams(false);
      }
    };
    fetchTeams();
  }, [user, open]);

  const selectedTeam = myTeams.find(t => t.id === selectedTeamId) || null;
  const memberCount = selectedTeam?.members.length ?? 0;
  const isEligible = memberCount > 0;

  const handleRegister = async () => {
    if (!selectedTeam || !rulesAccepted || !user) return;
    setLoading(true);

    try {
      // Build the players array from real team members
      const players: TeamMember[] = selectedTeam.members.length > 0
        ? selectedTeam.members
        : [{ name: user.username, bgmiId: user.username }];

      // 1. Create Razorpay order (or free booking)
      const orderData = await createRazorpayOrder(tournament.id, players.length, players);

      // Free tournament — skip Razorpay UI
      if (orderData.amount === 0) {
        await confirmPayment(orderData.paymentId, 'SUCCESS');
        toast.success(`Registered successfully for ${tournament.name}!`);
        onRegistered();
        onOpenChange(false);
        setSelectedTeamId('');
        setRulesAccepted(false);
        setLoading(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount * 100, // paise
        currency: orderData.currency || 'INR',
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
            setSelectedTeamId('');
            setRulesAccepted(false);
          } catch (confirmErr: any) {
            toast.error(confirmErr.message || 'Payment verification failed on server');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.username,
          email: user.email
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        try {
          await confirmPayment(orderData.paymentId, 'FAILED', response.error?.metadata?.payment_id);
        } catch (_) { /* best effort */ }
        toast.error(response.error?.description || 'Payment failed');
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
          {/* Tournament summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="mb-1 font-display text-sm font-bold">{tournament.name}</h4>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Prize: ₹{tournament.prizePool.toLocaleString('en-IN')}</span>
              <span>Teams: {tournament.registeredTeams}/{tournament.maxTeams}</span>
              <span>Entry: {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}</span>
            </div>
          </div>

          {/* Team select */}
          <div>
            <Label>Select Your Team</Label>
            {fetchingTeams ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading teams...
              </div>
            ) : (
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Choose a team..." />
                </SelectTrigger>
                <SelectContent>
                  {myTeams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      [{t.tag}] {t.name} — {t.members.length} member{t.members.length !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!fetchingTeams && myTeams.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                You don't have any teams. <span className="text-primary underline cursor-pointer" onClick={() => onOpenChange(false)}>Create one first.</span>
              </p>
            )}
          </div>

          {/* Eligibility indicator */}
          {selectedTeam && (
            <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${isEligible
                ? 'border-success/30 bg-success/5 text-success'
                : 'border-destructive/30 bg-destructive/5 text-destructive'
              }`}>
              {isEligible
                ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <div>
                <p className="font-medium">
                  {isEligible ? 'Team is eligible!' : 'Team needs members to register.'}
                </p>
                {isEligible && (
                  <p className="mt-0.5 text-xs opacity-80">
                    {selectedTeam.members.map(m => m.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Entry fee */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm text-muted-foreground">Entry Fee</span>
            <span className="font-display font-bold">
              {tournament.entryFee === 0
                ? <span className="text-success">FREE</span>
                : `₹${tournament.entryFee}`}
            </span>
          </div>

          {/* Rules checkbox */}
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
            disabled={!selectedTeamId || !rulesAccepted || !isEligible || loading}
            onClick={handleRegister}
          >
            {loading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              : tournament.entryFee === 0
                ? 'Confirm Free Registration'
                : `Pay ₹${tournament.entryFee} & Register`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
