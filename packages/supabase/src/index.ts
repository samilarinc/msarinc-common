export { initSupabase, getSupabaseClient } from './client';

export { loadSupabaseConfigFromEnv } from './config';
export type { SupabaseEnvConfig } from './config';

export {
  authClientOptions,
  authRedirectUrl,
  signInWithGoogle,
  sendEmailSignInLink,
  completeSignInFromUrl,
  listenForSignInLinks,
} from './auth';

export { uploadImage, deleteImage } from './storage';
export type { UploadImageResult } from './storage';
