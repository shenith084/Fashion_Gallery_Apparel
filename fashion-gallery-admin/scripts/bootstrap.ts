import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
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

const ALL_PERMISSIONS = {
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
};

async function bootstrap() {
  console.log('Starting exact bootstrap for Super Admin & Mock Data...');
  
  try {
    const superAdminUid = 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1';
    
    // 1. Set Custom Claim
    await auth.setCustomUserClaims(superAdminUid, { role: 'super_admin' });
    console.log('Set custom claims (God Mode) for Super Admin UID.');

    // 2. Add Super Admin to Staff Collection
    await db.collection('staff').doc(superAdminUid).set({
      name: 'Senith Chanidu',
      email: 'admin@fashiongallery.lk',
      role: 'super_admin',
      phone: '071 234 5678',
      isActive: true,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC&backgroundColor=e11d48&textColor=ffffff',
      permissions: ALL_PERMISSIONS
    }, { merge: true });
    
    console.log('Added Senith to Firestore staff collection.');

    // 3. Seed mock users
    const mockStaff = [
      {
        id: 'staff-2',
        name: 'Nimali Perera',
        email: 'nimali.perera@email.com',
        role: 'admin',
        phone: '077 123 4567',
        isActive: true,
        createdAt: new Date('2026-05-15T09:15:00').getTime(),
        lastLogin: new Date('2026-07-07T09:15:00').getTime(),
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NP&backgroundColor=7e22ce&textColor=ffffff',
        permissions: {}
      },
      {
        id: 'staff-3',
        name: 'Tharushi Silva',
        email: 'tharushi.s@email.com',
        role: 'staff',
        phone: '071 234 5676',
        isActive: true,
        createdAt: new Date('2026-05-20T08:45:00').getTime(),
        lastLogin: new Date('2026-07-07T08:45:00').getTime(),
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=0ea5e9&textColor=ffffff',
        permissions: {}
      }
    ];

    for (const staff of mockStaff) {
      await db.collection('staff').doc(staff.id).set(staff, { merge: true });
      console.log(`Seeded mock user: ${staff.name}`);
    }

    console.log('Bootstrap complete! Data is now perfectly seeded in your live database.');
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}

bootstrap();
