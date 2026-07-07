import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('roles').get();
    const roles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ roles });
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, name, description, permissions, isCustom } = data;

    if (!id || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await adminDb.collection('roles').doc(id).set({
      id,
      name,
      description,
      permissions,
      isCustom
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/roles POST:', error);
    return NextResponse.json({ error: error.message || 'Failed to create role' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, permissions } = data;

    if (!id || !permissions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await adminDb.collection('roles').doc(id).update({
      permissions
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/roles PUT:', error);
    return NextResponse.json({ error: error.message || 'Failed to update role permissions' }, { status: 500 });
  }
}
