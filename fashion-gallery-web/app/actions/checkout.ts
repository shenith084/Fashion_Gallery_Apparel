'use server';

import { getAdminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { Resend } from 'resend';
import { OrderReceipt } from '@/components/emails/OrderReceipt';

const resend = new Resend(process.env.RESEND_API_KEY);

const CheckoutSchema = z.object({
  customerId: z.string().nullable().optional(),
  customerEmail: z.string().email(),
  customer: z.string().min(1, 'Name is required'),
  phone: z.string().min(5, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  total: z.string().regex(/^LKR\s[\d,]+(\.\d{2})?$/, 'Invalid total format'),
  payment: z.enum(['Cash on Delivery', 'Bank Transfer']),
  items: z.array(z.object({
    id: z.string(),
    product: z.any(),
    qty: z.number().int().positive(),
    color: z.string().optional(),
    size: z.string().optional(),
  })).min(1, 'Cart is empty'),
  receiptImage: z.string().nullable().optional(),
  avatar: z.string().url().optional(),
});

export async function createOrderAction(orderData: any) {
  try {
    // Validate incoming data
    const parsedData = CheckoutSchema.parse(orderData);

    const adminDb = getAdminDb();
    const now = new Date();
    
    // Explicitly destructure to avoid passing unverified fields
    const docRef = await adminDb.collection('orders').add({
      customerId: parsedData.customerId || null,
      customerEmail: parsedData.customerEmail,
      customer: parsedData.customer,
      phone: parsedData.phone,
      email: parsedData.email,
      address: parsedData.address,
      total: parsedData.total,
      payment: parsedData.payment,
      items: parsedData.items,
      receiptImage: parsedData.receiptImage || null,
      avatar: parsedData.avatar || null,
      createdAt: now,
      date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
      isNew: true
    });
    
    // Attempt to send order receipt email
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Fashion Gallery Apparel <onboarding@resend.dev>',
          to: [parsedData.customerEmail, parsedData.email].filter(Boolean) as string[],
          subject: `Order Receipt #${docRef.id} - Fashion Gallery Apparel`,
          react: OrderReceipt({
            customerName: parsedData.customer,
            orderId: docRef.id,
            items: parsedData.items,
            total: parsedData.total,
            address: parsedData.address,
          }),
        });
      }
    } catch (emailError) {
      console.error('Failed to send order receipt email:', emailError);
      // We don't fail the order if the email fails.
    }
    
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error('Error creating order in Server Action:', error);
    return { success: false, error: error.message };
  }
}
