import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(idToken); // Basic auth check

    const snapshot = await adminDb.collection('wholesale_applications').orderBy('createdAt', 'desc').get();
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ apps });
  } catch (error: any) {
    console.error('Error fetching wholesale applications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
