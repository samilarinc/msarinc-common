export interface SupabaseEnvConfig {
  url?: string;
  anonKey?: string;
}

/** Each app provides its own Supabase project through the same EXPO_PUBLIC_SUPABASE_* variables. */
export function loadSupabaseConfigFromEnv(): SupabaseEnvConfig {
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}
