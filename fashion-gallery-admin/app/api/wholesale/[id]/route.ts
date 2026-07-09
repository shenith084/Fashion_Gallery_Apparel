import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { logActivity } from '@/lib/logger';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken); // Basic auth check

    const { id } = await params;
    const { status, isNew } = await request.json();

    if (status === undefined && isNew === undefined) {
      return NextResponse.json({ error: 'Status or isNew is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isNew !== undefined) updateData.isNew = isNew;

    await adminDb.collection('wholesale_applications').doc(id).update(updateData);

    // Log the activity if status was changed
    if (status !== undefined) {
      const staffDoc = await adminDb.collection('staff').doc(decodedToken.uid).get();
      const staffName = staffDoc.exists ? staffDoc.data()?.name : (decodedToken.name || 'Staff Member');
      
      await logActivity({
        userId: decodedToken.uid,
        userName: staffName,
        module: 'Wholesale',
        action: 'UPDATE_STATUS',
        description: `Updated wholesale application (${id}) status to ${status.toUpperCase()}`,
        status: 'success'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating wholesale application:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
