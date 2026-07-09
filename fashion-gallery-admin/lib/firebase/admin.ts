import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
if (!privateKey) {
  console.error("CRITICAL ERROR: FIREBASE_ADMIN_PRIVATE_KEY is missing in environment variables!");
} else {
  privateKey = privateKey.replace(/^"|"$/g, '');
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey || 'missing-key',
      }),
    });
  } catch (error) {
    console.error("Firebase Admin SDK Initialization Error:", error);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
