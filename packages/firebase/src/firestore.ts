import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { getFirebaseClient } from './client';

export interface UseFirestoreCollectionOptions {
  orderByField?: string;
  direction?: 'asc' | 'desc';
}

export interface UseFirestoreCollectionResult<T> {
  data: (T & { id: string })[];
  loading: boolean;
}

export function useFirestoreCollection<T = DocumentData>(
  path: string,
  options?: UseFirestoreCollectionOptions
): UseFirestoreCollectionResult<T> {
  const { db } = getFirebaseClient();
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const constraints = options?.orderByField ? [orderBy(options.orderByField, options.direction ?? 'desc')] : [];
    const q = query(collection(db, path), ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })));
      setLoading(false);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, options?.orderByField, options?.direction]);

  return { data, loading };
}

/** Adds createdAt as a server timestamp. */
export async function addFirestoreDoc<T extends object>(path: string, data: T) {
  const { db } = getFirebaseClient();
  return addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
}

export async function updateFirestoreDoc<T extends object>(path: string, id: string, data: Partial<T>) {
  const { db } = getFirebaseClient();
  return updateDoc(doc(db, path, id), { ...data, updatedAt: serverTimestamp() } as DocumentData);
}

export async function deleteFirestoreDoc(path: string, id: string) {
  const { db } = getFirebaseClient();
  return deleteDoc(doc(db, path, id));
}
