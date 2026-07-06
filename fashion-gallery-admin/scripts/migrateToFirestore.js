import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  const dbPath = path.join(process.cwd(), '..', 'database.json');
  console.log('Reading from:', dbPath);
  
  if (!fs.existsSync(dbPath)) {
    console.error('database.json not found!');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  console.log(`Migrating ${data.products?.length || 0} products...`);
  for (const item of data.products || []) {
    await setDoc(doc(db, 'products', item.id), item);
    console.log(`- Migrated product: ${item.id}`);
  }
  
  console.log(`Migrating ${data.orders?.length || 0} orders...`);
  for (const item of data.orders || []) {
    await setDoc(doc(db, 'orders', item.id), item);
    console.log(`- Migrated order: ${item.id}`);
  }
  
  console.log(`Migrating ${data.returns?.length || 0} returns...`);
  for (const item of data.returns || []) {
    await setDoc(doc(db, 'returns', item.id), item);
    console.log(`- Migrated return: ${item.id}`);
  }

  console.log('Migration Complete!');
  process.exit(0);
}

migrate().catch(console.error);
