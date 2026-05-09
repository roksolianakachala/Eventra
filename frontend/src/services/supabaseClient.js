import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseRealtimeConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseRealtimeConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function applySupabaseRealtimeAuth(token) {
  if (!supabase || !token) return;

  supabase.realtime.setAuth(token);
}
