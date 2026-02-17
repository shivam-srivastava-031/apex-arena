import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
}

const gameColors: Record<string, string> = {
  BGMI: 'bg-primary text-primary-foreground',
  FreeFire: 'bg-warning text-warning-foreground',
  CODMobile: 'bg-success text-success-foreground',
};

const statusStyles: Record<string, string> = {
  registration: 'bg-primary/15 text-primary border-primary/30',
  live: 'bg-destructive/15 text-destructive border-destructive/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

const statusLabels: Record<string, string> = {
  registration: 'Registration Open',
  live: '🔴 Live',
  completed: 'Completed',
};

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export function TournamentCard({ tournament }: { tournament: TournamentProp }) {
  const fillPercent = (tournament.registeredTeams / tournament.maxTeams) * 100;

  return (
    <div className="gaming-card group flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${gameColors[tournament.gameType] || 'bg-muted text-muted-foreground'}`}>
          {tournament.gameType}
        </span>
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[tournament.status] || ''}`}>
          {statusLabels[tournament.status] || tournament.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <h3 className="font-display text-base font-bold leading-tight tracking-wide">{tournament.name}</h3>
        <div className="text-gradient font-display text-2xl font-black">{formatCurrency(tournament.prizePool)}</div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(tournament.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            {' - '}
            {new Date(tournament.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" />Teams</span>
            <span className="font-medium">{tournament.registeredTeams}/{tournament.maxTeams}</span>
          </div>
          <Progress value={fillPercent} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between">
          {tournament.entryFee === 0 ? (
            <Badge variant="secondary" className="bg-success/15 text-success">FREE</Badge>
          ) : (
            <span className="text-sm font-semibold">{formatCurrency(tournament.entryFee)} entry</span>
          )}
        </div>

        <Button asChild className="mt-auto w-full gradient-primary border-0">
          <Link to={`/tournaments/${tournament.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}
