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
    let wholesaleSnapshot;
    
    if (email) {
      const [ordersByCustomerEmail, ordersByEmail, wholesale] = await Promise.all([
        db.collection('orders').where('customerEmail', '==', email).get(),
        db.collection('orders').where('email', '==', email).get(),
        db.collection('wholesale_applications').where('email', '==', email).get()
      ]);

      const allOrderDocs = new Map();
      ordersByCustomerEmail.forEach(doc => allOrderDocs.set(doc.id, doc));
      ordersByEmail.forEach(doc => allOrderDocs.set(doc.id, doc));
      
      snapshot = { docs: Array.from(allOrderDocs.values()) };
      wholesaleSnapshot = wholesale;
    } else {
      snapshot = await db.collection('orders')
        .where('customerId', '==', userId)
        .get();
      
      // Unfortunately wholesale_applications doesn't have customerId, but try via email if user exists
      wholesaleSnapshot = { docs: [] };
    }

    const regularOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const wholesaleOrders = wholesaleSnapshot?.docs.map(doc => {
      const data = doc.data();
      const statusMap: any = {
        'pending': 'Processing',
        'approved': 'Approved',
        'rejected': 'Cancelled'
      };
      
      return {
        id: doc.id,
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown',
        createdAt: { _seconds: Math.floor(data.createdAt / 1000) },
        status: statusMap[data.status] || data.status,
        total: 'TBD',
        items: [{
          product: { name: 'Wholesale Application', price: 0, image: '/logo.svg' },
          qty: 1,
          color: data.products, // Using color field to show interested products
          size: data.businessType
        }]
      };
    }) || [];

    const orders = [...regularOrders, ...wholesaleOrders];
    
    // Sort in memory to avoid needing a Firestore composite index
    orders.sort((a: any, b: any) => {
      const timeA = a.createdAt?._seconds || 0;
      const timeB = b.createdAt?._seconds || 0;
      return timeB - timeA;
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([], { status: 500 });
  }
}
