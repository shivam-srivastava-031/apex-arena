import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (email: string, password: string, metadata = {}) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

// Data operations
export const fetchTournaments = async () => {
  return await supabase
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: true });
};

export const fetchTeams = async () => {
  return await supabase
    .from('teams')
    .select('*, members(*, profiles(*))');
};

export const createTeam = async (teamData: any) => {
  return await supabase
    .from('teams')
    .insert([teamData])
    .select()
    .single();
};

export const updateTeam = async (id: string, updates: any) => {
  return await supabase
    .from('teams')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
};

export const registerForTournament = async (tournamentId: string, teamId: string) => {
  return await supabase
    .from('registrations')
    .insert([{ tournament_id: tournamentId, team_id: teamId }]);
};

// Realtime subscriptions
export const subscribeToTournamentUpdates = (tournamentId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('tournament_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tournaments',
        filter: `id=eq.${tournamentId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};
