export interface FirebaseEnvConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export interface GoogleClientIds {
  web?: string;
  ios?: string;
  android?: string;
}

/**
 * Her uygulama kendi Firebase projesine ait değerleri process.env üzerinden
 * aynı EXPO_PUBLIC_FIREBASE_* isimleriyle sağlar (bkz. .env.example).
 */
export function loadFirebaseConfigFromEnv(): FirebaseEnvConfig {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function loadGoogleClientIdsFromEnv(): GoogleClientIds {
  return {
    web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  };
}
