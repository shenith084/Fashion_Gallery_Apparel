// Firebase Admin SDK — server-side only
// Used in: Server Actions, Route Handlers (never in browser)
// Requires: FIREBASE_ADMIN_* environment variables (service account)
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Service account credentials — set via environment variables
  // Go to Firebase Console → Project Settings → Service Accounts → Generate new private key
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.replace(/^"|"$/g, '');
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.replace(/^"|"$/g, '');
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  
  if (privateKey) {
    // Strip quotes if they exist
    privateKey = privateKey.replace(/^"|"$/g, '');
    // Handle newlines depending on how Vercel escaped them
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    // During development without admin credentials, skip admin initialization
    // Admin SDK is only required for server-side writes and custom claims
    console.warn(
      '[Firebase Admin] Missing service account credentials. ' +
      'Add FIREBASE_ADMIN_* to .env.local to enable server-side operations.'
    );
    // Initialize with just projectId for read operations
    return initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

// Lazily initialize to avoid issues during build
function getAdminDb(): Firestore {
  if (!adminApp) adminApp = getAdminApp();
  if (!adminDb) adminDb = getFirestore(adminApp);
  return adminDb;
}

export { getAdminDb };
