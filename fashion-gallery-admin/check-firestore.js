const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function check() {
  const doc = await db.collection('settings').doc('fashion_videos').get();
  console.log('Exists?', doc.exists);
  if (doc.exists) {
    console.log(JSON.stringify(doc.data(), null, 2));
  }
}
check();
