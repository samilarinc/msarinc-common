import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseEnvConfig } from './config';

let client: SupabaseClient | null = null;

/**
 * Uygulama başlangıcında bir kez çağrılır (örn. App.tsx içinde import edilen
 * bir services/supabase.ts dosyasından). Aynı config ile tekrar çağrılması
 * güvenlidir; zaten kurulmuş client'ı döndürür.
 */
export function initSupabase(config: SupabaseEnvConfig): SupabaseClient {
  if (client) return client;

  if (!config.url || !config.anonKey) {
    console.warn(
      '[@msarinc/supabase] Supabase config eksik. .env dosyanıza EXPO_PUBLIC_SUPABASE_* değerlerini ekleyin.'
    );
  }

  client = createClient(config.url ?? '', config.anonKey ?? '');
  return client;
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error('[@msarinc/supabase] initSupabase() henüz çağrılmadı.');
  }
  return client;
}
