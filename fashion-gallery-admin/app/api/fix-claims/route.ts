import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('staff').get();
    
    const updates = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const uid = doc.id;
      const role = data.role;
      
      const claimRole = (role === 'admin' || role === 'super_admin') ? role : 'staff';
      
      updates.push(
        adminAuth.setCustomUserClaims(uid, { role: claimRole })
          .catch((err) => {
            console.error(`Failed to set claim for ${uid}:`, err.message);
          })
      );
    }
    
    await Promise.all(updates);
    
    return NextResponse.json({ success: true, message: 'All staff claims have been fixed. Please log out and log back in to refresh your permissions.' });
  } catch (error: any) {
    console.error('Error fixing claims:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
