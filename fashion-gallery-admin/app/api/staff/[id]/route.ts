import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const callerRole = decodedToken.role || 'staff';
    const isSuperAdmin = callerUid === 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1' || callerRole === 'super_admin';
    const isAdmin = callerRole === 'admin';
    
    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied. Admins only.' }, { status: 403 });
    }

    const { id: targetStaffId } = await params;
    if (callerUid === targetStaffId) {
      return NextResponse.json({ error: 'You cannot delete yourself.' }, { status: 400 });
    }

    // Fetch the target staff member
    const targetDoc = await adminDb.collection('staff').doc(targetStaffId).get();
    if (!targetDoc.exists) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    const targetData = targetDoc.data();
    const targetRole = targetData?.role;

    // Protection Logic
    if (targetRole === 'super_admin') {
      return NextResponse.json({ error: 'Super Admins cannot be deleted.' }, { status: 403 });
    }

    if (targetRole === 'admin' && !isSuperAdmin) {
      return NextResponse.json({ error: 'Only Super Admins can delete other Admins.' }, { status: 403 });
    }

    // Perform deletion
    try {
      await adminAuth.deleteUser(targetStaffId);
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') {
        throw err;
      }
      console.log('User not found in Auth, proceeding to delete from Firestore');
    }
    
    await adminDb.collection('staff').doc(targetStaffId).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const callerRole = decodedToken.role || 'staff';
    const isSuperAdmin = callerUid === 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1' || callerRole === 'super_admin';
    const isAdmin = callerRole === 'admin';
    
    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied. Admins only.' }, { status: 403 });
    }

    const { id: targetStaffId } = await params;
    const { role, name, phone } = await request.json();

    if (!role && !name && phone === undefined) {
      return NextResponse.json({ error: 'No data provided to update.' }, { status: 400 });
    }

    // Protection Logic
    const targetDoc = await adminDb.collection('staff').doc(targetStaffId).get();
    if (!targetDoc.exists) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }
    const targetRole = targetDoc.data()?.role;

    if (targetRole === 'super_admin' && !isSuperAdmin) {
      return NextResponse.json({ error: 'You cannot modify a Super Admin.' }, { status: 403 });
    }
    if ((role === 'admin' || role === 'super_admin') && !isSuperAdmin) {
      return NextResponse.json({ error: 'Only Super Admins can assign Admin/Super Admin roles.' }, { status: 403 });
    }

    // Update Auth Claim if role changed
    if (role && role !== targetRole) {
      const claimRole = (role === 'admin' || role === 'super_admin') ? role : 'staff';
      await adminAuth.setCustomUserClaims(targetStaffId, { role: claimRole });
    }
    
    // Update Auth User if name changed
    if (name) {
      try {
        await adminAuth.updateUser(targetStaffId, { displayName: name });
      } catch (err: any) {
        if (err.code !== 'auth/user-not-found') throw err;
        console.log('User not found in Auth, skipping Auth displayName update');
      }
    }

    // Update Firestore
    const updateData: any = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    if (role === 'super_admin') {
      updateData.permissions = {
        'product.view': true, 'product.edit_details': true, 'product.edit_price': true, 'product.edit_stock': true, 'product.delete': true,
        'order.view': true, 'order.view_financials': true, 'order.update_status': true, 'order.cancel': true,
        'customer.view': true, 'wholesale.view': true, 'wholesale.manage_pricing': true,
        'staff.manage': true, 'settings.manage': true, 'reports.view_sales': true, 'reports.view_marketing': true,
        'media.upload': true, 'audit_log.view': true,
      };
    }
    
    if (Object.keys(updateData).length > 0) {
      await adminDb.collection('staff').doc(targetStaffId).update(updateData);
    }

    return NextResponse.json({ success: true, role });
  } catch (error: any) {
    console.error('Error updating staff role:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
