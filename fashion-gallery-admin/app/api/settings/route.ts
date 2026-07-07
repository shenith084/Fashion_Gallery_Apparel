import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const callerRole = decodedToken.role || 'staff';
    
    // Check if super_admin or has settings.manage
    if (callerRole !== 'super_admin') {
      const staffDoc = await adminDb.collection('staff').doc(callerUid).get();
      if (!staffDoc.exists || !staffDoc.data()?.permissions?.['settings.manage']) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const body = await request.json();
    const docId = body.docId || 'contact';
    const data = { ...body };
    delete data.docId; // Don't save docId in the document
    await adminDb.collection('settings').doc(docId).set(data, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('docId') || 'contact';
    
    const doc = await adminDb.collection('settings').doc(docId).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: doc.data() });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
