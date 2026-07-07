import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const callerRole = decodedToken.role || 'staff';
    
    // Check if super_admin or has audit_log.view
    if (callerRole !== 'super_admin') {
      const staffDoc = await adminDb.collection('staff').doc(callerUid).get();
      if (!staffDoc.exists || !staffDoc.data()?.permissions?.['audit_log.view']) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    const logsSnapshot = await adminDb.collection('activity_logs')
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();

    const logs = logsSnapshot.docs.map(doc => doc.data());

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
