import { Link } from 'react-router-dom';
import { Users, Trophy } from 'lucide-react';
import { Team } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function TeamCard({ team }: { team: Team }) {
  return (
    <div className="gaming-card flex flex-col items-center p-6 text-center">
      {/* Team logo */}
      <div className="gradient-primary mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-primary-foreground shadow-glow">
        {team.tag}
      </div>

      <h3 className="font-display text-lg font-bold tracking-wide">{team.name}</h3>
      <span className="mb-4 text-sm text-muted-foreground">[{team.tag}]</span>

      <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" /> {team.members.length} members
        </span>
        <span className="flex items-center gap-1">
          <Trophy className="h-4 w-4" /> {team.tournamentsCount ?? 0} tournaments
        </span>
      </div>

      {/* Member avatars */}
      <div className="mb-4 flex -space-x-2">
        {team.members.slice(0, 4).map((m) => (
          <Avatar key={m.id} className="h-8 w-8 border-2 border-card">
            <AvatarFallback className="bg-muted text-xs">{m.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        ))}
        {team.members.length > 4 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
            +{team.members.length - 4}
          </div>
        )}
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link to={`/dashboard/teams/${team.id}`}>Manage</Link>
      </Button>
    </div>
  );
}
