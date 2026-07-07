import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(collection(db, 'products'), where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return NextResponse.json([], { status: 500 });
  }
}
