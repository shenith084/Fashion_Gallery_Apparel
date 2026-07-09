import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const returnData = await request.json();
    const db = getAdminDb();

    // Format new return
    const id = `RTN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReturn = {
      ...returnData,
      id,
      status: 'Requested',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date(),
      isNew: true
    };

    // Save to Firestore
    await db.collection('returns').doc(id).set(newReturn);

    // Also update the original order's status to 'Return Requested'
    if (returnData.orderId) {
      await db.collection('orders').doc(returnData.orderId).update({
        status: 'Return Requested'
      });
    }

    return NextResponse.json({ success: true, returnData: newReturn });
  } catch (error) {
    console.error('Error saving return:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit return' }, { status: 500 });
  }
}
