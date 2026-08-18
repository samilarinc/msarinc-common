import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import {
  type User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { doc, getDoc, setDoc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { getFirebaseClient } from './client';
import type { GoogleClientIds } from './config';

WebBrowser.maybeCompleteAuthSession();

export interface FirebaseUserProfile extends DocumentData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: number;
}

export interface AuthContextValue<TProfile extends FirebaseUserProfile = FirebaseUserProfile> {
  user: User | null;
  userProfile: TProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

export interface AuthProviderProps<TProfile extends FirebaseUserProfile = FirebaseUserProfile> {
  children: ReactNode;
  /** Deep link scheme, app.json/app.config.js içindeki "scheme" ile aynı olmalı. */
  scheme: string;
  googleClientIds: GoogleClientIds;
  /** Kullanıcı profillerinin tutulacağı koleksiyon adı. Varsayılan: 'users'. */
  usersCollection?: string;
  /** İlk girişte varsayılan profile ek alanlar eklemek için. */
  buildProfile?: (user: User) => TProfile;
  /** İsim boş geldiğinde kullanılacak metin (i18n). */
  unnamedUserLabel?: string;
}

const AuthContext = createContext<AuthContextValue<any> | undefined>(undefined);

export function AuthProvider<TProfile extends FirebaseUserProfile = FirebaseUserProfile>({
  children,
  scheme,
  googleClientIds,
  usersCollection = 'users',
  buildProfile,
  unnamedUserLabel = 'İsimsiz kullanıcı',
}: AuthProviderProps<TProfile>) {
  const { auth, db, googleProvider } = getFirebaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // expo-auth-session zorunlu tutuyor: mevcut platform için client id tanımlı olmalı,
  // web'de gerçek akış signInWithPopup olduğundan bu hook hiç kullanılmıyor ama yine de
  // render sırasında doğrulanıyor — boş string ile satisfy edip crash'i önlüyoruz.
  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: googleClientIds.web ?? '',
    iosClientId: googleClientIds.ios ?? '',
    androidClientId: googleClientIds.android ?? '',
    redirectUri: AuthSession.makeRedirectUri({ scheme, preferLocalhost: true }),
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    if (!user) return;
    const profileRef = doc(db, usersCollection, user.uid);

    const ensureProfile = async () => {
      const snap = await getDoc(profileRef);
      if (!snap.exists()) {
        const base: FirebaseUserProfile = {
          uid: user.uid,
          displayName: user.displayName || unnamedUserLabel,
          email: user.email || '',
          photoURL: user.photoURL,
          createdAt: Date.now(),
        };
        const profile = buildProfile ? buildProfile(user) : (base as TProfile);
        await setDoc(profileRef, profile);
      }
    };
    ensureProfile();

    const unsub = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) setUserProfile(snap.data() as TProfile);
      setLoading(false);
    });
    return () => unsub();
  }, [user, db, usersCollection, buildProfile, unnamedUserLabel]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);
        signInWithCredential(auth, credential);
      }
    } else if (response?.type === 'error') {
      console.error('[@msarinc/firebase] Google Auth error:', response);
    }
  }, [response, auth]);

  const signInWithGoogle = async () => {
    if (Platform.OS === 'web') {
      await signInWithPopup(auth, googleProvider);
    } else {
      await promptAsync();
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth<TProfile extends FirebaseUserProfile = FirebaseUserProfile>(): AuthContextValue<TProfile> {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
