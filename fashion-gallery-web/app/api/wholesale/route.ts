import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.fullName || !data.businessName || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docData = {
      ...data,
      status: 'pending',
      createdAt: Date.now()
    };

    const adminDb = getAdminDb();
    const docRef = await adminDb.collection('wholesale_applications').add(docData);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('Error submitting wholesale application:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
