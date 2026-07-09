'use server';

import { getAdminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

const InquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(5, 'Phone is required').max(20),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message is too short').max(2000, 'Message is too long'),
});

export async function submitInquiryAction(formData: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  try {
    const parsedData = InquirySchema.parse(formData);
    const adminDb = getAdminDb();
    
    // Pass only validated fields
    await adminDb.collection('inquiries').add({
      name: parsedData.name,
      phone: parsedData.phone,
      email: parsedData.email,
      message: parsedData.message,
      status: 'Unread',
      createdAt: new Date(),
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting inquiry in Server Action:', error);
    return { success: false, error: error.message };
  }
}
