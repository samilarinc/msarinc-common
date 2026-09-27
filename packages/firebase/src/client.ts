import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// @ts-ignore: getReactNativePersistence exists at runtime but is missing from the types
import { getAuth, initializeAuth, getReactNativePersistence, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseEnvConfig } from './config';

export interface FirebaseClient {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  googleProvider: GoogleAuthProvider;
}

let client: FirebaseClient | null = null;

/** Call once at startup. Calling it again is safe and returns the existing client. */
export function initFirebase(config: FirebaseEnvConfig): FirebaseClient {
  if (client) return client;

  if (!config.apiKey || !config.projectId) {
    console.warn(
      '[@msarinc/firebase] Firebase config is missing. Add the EXPO_PUBLIC_FIREBASE_* values to your .env file.'
    );
  }

  const app = getApps().length ? getApp() : initializeApp(config as Record<string, string>);

  const auth =
    Platform.OS === 'web'
      ? getAuth(app)
      : initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });

  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  client = { app, auth, db, googleProvider };
  return client;
}

export function getFirebaseClient(): FirebaseClient {
  if (!client) {
    throw new Error('[@msarinc/firebase] initFirebase() has not been called yet.');
  }
  return client;
}
