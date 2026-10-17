import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { getSupabaseClient } from './client';

/**
 * Client options for apps that sign users in, to pass to initSupabase. PKCE: Google redirects and
 * e-mail links come back with a one-time code. The web client reads it from the page URL itself;
 * native apps receive it through their URL scheme (see listenForSignInLinks).
 */
export function authClientOptions(): SupabaseClientOptions<'public'> {
  return {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: Platform.OS === 'web',
      ...(Platform.OS === 'web' ? {} : { storage: AsyncStorage }),
    },
  };
}

/**
 * Where sign-in sends people back: `webPath` on the current site, `<scheme>://auth` in the app.
 * Both must be listed under Authentication → URL Configuration → Redirect URLs in Supabase.
 */
export function authRedirectUrl(webPath = '/'): string {
  return Platform.OS === 'web' ? `${window.location.origin}${webPath}` : Linking.createURL('auth');
}

/** On the web the page goes to Google; in the app an in-app browser opens and the session is set on return. */
export async function signInWithGoogle(redirectTo: string): Promise<void> {
  const client = getSupabaseClient();
  const native = Platform.OS !== 'web';
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: native },
  });
  if (error) throw error;
  if (!native) return;
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === 'success') await completeSignInFromUrl(result.url);
}

/** Sends a one-time sign-in link; opening it on the same device signs in (new addresses get an account). */
export async function sendEmailSignInLink(email: string, redirectTo: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

/** Finishes a sign-in from a returned URL carrying `?code=…`. Other URLs are ignored. */
export async function completeSignInFromUrl(url: string): Promise<void> {
  const code = Linking.parse(url).queryParams?.code;
  if (typeof code === 'string') await getSupabaseClient().auth.exchangeCodeForSession(code);
}

/** Native: completes sign-ins from links that open the app, at launch or while it runs. Returns a cleanup. */
export function listenForSignInLinks(): () => void {
  if (Platform.OS === 'web') return () => {};
  Linking.getInitialURL().then((url) => {
    if (url) completeSignInFromUrl(url);
  });
  const subscription = Linking.addEventListener('url', ({ url }) => completeSignInFromUrl(url));
  return () => subscription.remove();
}
