import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// @ts-ignore: getReactNativePersistence tipte tanımlı değil ama runtime'da mevcut
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

/**
 * Uygulama başlangıcında bir kez çağrılır (örn. App.tsx içinde import edilen
 * bir services/firebase.ts dosyasından). Aynı config ile tekrar çağrılması
 * güvenlidir; zaten kurulmuş client'ı döndürür.
 */
export function initFirebase(config: FirebaseEnvConfig): FirebaseClient {
  if (client) return client;

  if (!config.apiKey || !config.projectId) {
    console.warn(
      '[@msarinc/firebase] Firebase config eksik. .env dosyanıza EXPO_PUBLIC_FIREBASE_* değerlerini ekleyin.'
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
    throw new Error('[@msarinc/firebase] initFirebase() henüz çağrılmadı.');
  }
  return client;
}
