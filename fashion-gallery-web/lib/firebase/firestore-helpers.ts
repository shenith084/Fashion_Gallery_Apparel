// Firestore Helper Functions — client-side
// Generic CRUD utilities built on top of the Firebase client SDK

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Query,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './client';

// ─── READ ─────────────────────────────────────────────────────

/** Get a single document by ID */
export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const ref = doc(db, collectionName, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

/** Get all documents from a collection with optional constraints */
export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(db, collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : ref;
  const snap = await getDocs(q as Query<DocumentData>);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

// ─── WRITE ────────────────────────────────────────────────────

/** Add a new document (auto-ID) */
export async function addDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> {
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Set a document with a specific ID */
export async function setDocument<T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  data: Omit<T, 'id'>
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Update specific fields in an existing document */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Soft delete — sets a deletedAt timestamp instead of removing */
export async function softDeleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await updateDoc(ref, {
    status: 'deleted',
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ─── REAL-TIME ────────────────────────────────────────────────

/** Subscribe to real-time updates on a collection */
export function subscribeToCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (docs: T[]) => void
): Unsubscribe {
  const ref = collection(db, collectionName);
  const q = query(ref, ...constraints);
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    callback(docs);
  });
}

/** Subscribe to real-time updates on a single document */
export function subscribeToDocument<T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
): Unsubscribe {
  const ref = doc(db, collectionName, docId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback({ id: snap.id, ...snap.data() } as T);
  });
}

// ─── EXPORTS ─────────────────────────────────────────────────
export { where, orderBy, limit, serverTimestamp };
