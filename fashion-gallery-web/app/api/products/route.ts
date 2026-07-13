import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

// Cache product list for 60 seconds on Vercel CDN (stale-while-revalidate)
export const revalidate = 60;

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection('products')
      .where('status', '==', 'Active')
      .get();

    const products: any[] = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(products, {
      headers: {
        // Cache at browser level for 60s, Vercel CDN for 300s
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return NextResponse.json([], { status: 500 });
  }
}
