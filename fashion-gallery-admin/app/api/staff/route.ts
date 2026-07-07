import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { defaultStaffPermissions, defaultAdminPermissions } from '@/types/staff';

const ALL_PERMISSIONS = {
  'product.view': true,
  'product.edit_details': true,
  'product.edit_price': true,
  'product.edit_stock': true,
  'product.delete': true,
  'order.view': true,
  'order.view_financials': true,
  'order.update_status': true,
  'order.cancel': true,
  'customer.view': true,
  'wholesale.view': true,
  'wholesale.manage_pricing': true,
  'staff.manage': true,
  'settings.manage': true,
  'reports.view_sales': true,
  'reports.view_marketing': true,
  'media.upload': true,
  'audit_log.view': true,
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify token and get caller's UID and role
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const callerRole = decodedToken.role || 'staff'; // custom claim
    
    // Check caller's staff doc to confirm they are active
    const callerDoc = await adminDb.collection('staff').doc(callerUid).get();
    if (!callerDoc.exists || !callerDoc.data()?.isActive) {
      return NextResponse.json({ error: 'Your account is inactive or not found' }, { status: 403 });
    }

    const isSuperAdmin = callerUid === 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1' || callerRole === 'super_admin';
    const isAdmin = callerRole === 'admin';
    
    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied. Admins only.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only Super Admins can create Super Admins or Admins
    if ((role === 'super_admin' || role === 'admin') && !isSuperAdmin) {
      return NextResponse.json({ error: 'Only Super Admins can assign Admin/Super Admin roles' }, { status: 403 });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Set Custom Claims
    // Firestore rules strict-check 'staff' or 'admin'. Custom roles must be cast to 'staff' for the claim.
    const claimRole = (role === 'admin' || role === 'super_admin') ? role : 'staff';
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: claimRole });

    // 3. Determine Initial Permissions
    let initialPermissions = defaultStaffPermissions;
    if (role === 'admin') initialPermissions = defaultAdminPermissions;
    if (role === 'super_admin') initialPermissions = ALL_PERMISSIONS;

    const newStaffData = {
      name,
      email,
      phone: phone || '',
      role,
      isActive: true,
      permissions: initialPermissions,
      createdAt: Date.now(),
    };

    // 4. Save to Firestore
    await adminDb.collection('staff').doc(userRecord.uid).set(newStaffData);

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
