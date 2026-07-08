import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { getAdminDb } from '../lib/firebase/admin';

async function fixProductNames() {
  const db = getAdminDb();
  const snapshot = await db.collection('products').get();
  
  let fixed = 0;
  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.title && !data.name) {
      batch.update(doc.ref, {
        name: data.title
      });
      fixed++;
    }
  });

  await batch.commit();
  console.log(`Fixed ${fixed} products by setting 'name' from 'title'`);
}

fixProductNames().catch(console.error);
