export { initFirebase, getFirebaseClient } from './client';
export type { FirebaseClient } from './client';

export { loadFirebaseConfigFromEnv, loadGoogleClientIdsFromEnv } from './config';
export type { FirebaseEnvConfig, GoogleClientIds } from './config';

export { AuthProvider, useAuth } from './AuthContext';
export type { AuthContextValue, AuthProviderProps, FirebaseUserProfile } from './AuthContext';

export {
  useFirestoreCollection,
  addFirestoreDoc,
  updateFirestoreDoc,
  deleteFirestoreDoc,
} from './firestore';
export type { UseFirestoreCollectionOptions, UseFirestoreCollectionResult } from './firestore';
