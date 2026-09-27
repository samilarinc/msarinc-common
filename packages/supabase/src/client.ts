import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseEnvConfig } from './config';

let client: SupabaseClient | null = null;

/** Call once at startup. Calling it again is safe and returns the existing client. */
export function initSupabase(config: SupabaseEnvConfig): SupabaseClient {
  if (client) return client;

  if (!config.url || !config.anonKey) {
    console.warn(
      '[@msarinc/supabase] Supabase config is missing. Add the EXPO_PUBLIC_SUPABASE_* values to your .env file.'
    );
  }

  client = createClient(config.url ?? '', config.anonKey ?? '');
  return client;
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error('[@msarinc/supabase] initSupabase() has not been called yet.');
  }
  return client;
}
