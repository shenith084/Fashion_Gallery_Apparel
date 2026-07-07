'use server';

import { getAdminDb } from '@/lib/firebase/admin';

export async function submitInquiryAction(formData: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  try {
    const adminDb = getAdminDb();
    
    await adminDb.collection('inquiries').add({
      ...formData,
      status: 'Unread',
      createdAt: new Date(),
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting inquiry in Server Action:', error);
    return { success: false, error: error.message };
  }
}
