'use server';

import { getAdminDb } from '@/lib/firebase/admin';

export async function createOrderAction(orderData: any) {
  try {
    const adminDb = getAdminDb();
    const docRef = await adminDb.collection('orders').add({
      ...orderData,
      createdAt: new Date(),
      isNew: true
    });
    
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error('Error creating order in Server Action:', error);
    return { success: false, error: error.message };
  }
}
