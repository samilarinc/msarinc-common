export interface SupabaseEnvConfig {
  url?: string;
  anonKey?: string;
}

/**
 * Her uygulama kendi Supabase projesine ait değerleri process.env üzerinden
 * aynı EXPO_PUBLIC_SUPABASE_* isimleriyle sağlar (bkz. .env.example).
 */
export function loadSupabaseConfigFromEnv(): SupabaseEnvConfig {
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}
