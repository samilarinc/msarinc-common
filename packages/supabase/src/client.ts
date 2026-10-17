import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { SupabaseEnvConfig } from './config';

let client: SupabaseClient | null = null;

/**
 * Call once at startup. Calling it again is safe and returns the existing client.
 * Apps that sign users in pass `options.auth` (e.g. AsyncStorage on native, PKCE flow).
 */
export function initSupabase(config: SupabaseEnvConfig, options?: SupabaseClientOptions<'public'>): SupabaseClient {
  if (client) return client;

  if (!config.url || !config.anonKey) {
    console.warn(
      '[@msarinc/supabase] Supabase config is missing. Add the EXPO_PUBLIC_SUPABASE_* values to your .env file.'
    );
  }

  client = createClient(config.url ?? '', config.anonKey ?? '', options);
  return client;
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error('[@msarinc/supabase] initSupabase() has not been called yet.');
  }
  return client;
}
