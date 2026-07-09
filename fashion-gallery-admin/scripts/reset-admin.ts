import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

async function resetAdmin() {
  try {
    const email = 'admin@fashiongallery.lk';
    const newPassword = 'password123';
    
    console.log(`Checking for user ${email}...`);
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log('User found! Resetting password...');
      await auth.updateUser(user.uid, { password: newPassword });
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        console.log('User not found! Creating new Super Admin account...');
        user = await auth.createUser({
          email,
          password: newPassword,
          displayName: 'Super Admin',
        });
      } else {
        throw e;
      }
    }

    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { role: 'super_admin' });
    console.log('Custom claims set to super_admin.');

    // Create staff document
    await db.collection('staff').doc(user.uid).set({
      name: 'Super Admin',
      email: email,
      role: 'super_admin',
      isActive: true,
      permissions: {
        'product.view': true,
        'product.edit_details': true,
        'product.edit_price': true,
        'product.edit_stock': true,
        'product.delete': true,
        'order.view': true,
        'order.view_financials': true,
        'order.update_status': true,
        'order.cancel': true,
        'customer.view': true,
        'wholesale.view': true,
        'wholesale.manage_pricing': true,
        'staff.manage': true,
        'settings.manage': true,
        'reports.view_sales': true,
        'reports.view_marketing': true,
        'media.upload': true,
        'audit_log.view': true,
      },
      createdAt: Date.now()
    });
    console.log('Staff document created/updated.');

    console.log(`\n✅ SUCCESS!`);
    console.log(`You can now log in with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

resetAdmin();
