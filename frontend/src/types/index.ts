export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
}

export type GameType = 'BGMI' | 'FreeFire' | 'CODMobile';
export type TournamentStatus = 'registration' | 'live' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  gameType: GameType;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  registeredTeams: number;
  maxTeams: number;
  entryFee: number;
  description: string;
  rules?: string[];
  prizeDistribution?: { place: string; prize: string }[];
}

export interface TeamMember {
  id: string;
  username: string;
  avatar?: string;
  role: 'captain' | 'member';
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo?: string;
  captainId: string;
  members: TeamMember[];
  createdAt: string;
  tournamentsCount?: number;
  wins?: number;
}

export interface Match {
  id: string;
  tournamentName: string;
  opponent: string;
  date: string;
  time: string;
  gameType: GameType;
}

export interface LeaderboardEntry {
  rank: number;
  team: string;
  points: number;
  kills: number;
  prize: string;
}
