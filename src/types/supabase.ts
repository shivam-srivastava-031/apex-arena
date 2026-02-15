export type Tournament = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  game: string;
  prize_pool: number;
  max_teams: number;
  status: 'upcoming' | 'ongoing' | 'completed';
};

export type Team = {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  created_at: string;
  members: Array<{
    id: string;
    role: 'leader' | 'member';
    profiles: {
      id: string;
      username: string;
      avatar_url?: string;
    };
  }>;
};

export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};
