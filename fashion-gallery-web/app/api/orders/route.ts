import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json([], { status: 400 });
    }

    const db = getAdminDb();
    let snapshot;

    if (email) {
      snapshot = await db.collection('orders')
        .where('customerEmail', '==', email)
        .orderBy('createdAt', 'desc')
        .get();

      // Also try alternate email field
      if (snapshot.empty) {
        snapshot = await db.collection('orders')
          .where('email', '==', email)
          .orderBy('createdAt', 'desc')
          .get();
      }
    } else {
      snapshot = await db.collection('orders')
        .where('customerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
    }

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([], { status: 500 });
  }
}
