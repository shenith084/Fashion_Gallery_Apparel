'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'react-hot-toast';
import styles from './CheckoutClient.module.css';

export default function CheckoutClient({ 
  initialPaymentSettings,
  deliverySettings 
}: { 
  initialPaymentSettings?: any,
  deliverySettings?: any 
}) {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>(initialPaymentSettings || null);
  const { items, getSubtotal, clearCart } = useCartStore();
  const { useRouter } = require('next/navigation');
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    setMounted(true);
    if (mounted && !user) {
      router.push('/login?returnUrl=/checkout');
    }
  }, [mounted, user, router]);

  const subtotal = getSubtotal();
  
  let deliveryFee = 0;
  if (subtotal > 0) {
    deliveryFee = deliverySettings?.standardDeliveryCharge || 350;
  }

  const total = subtotal + deliveryFee;

  const isFormValid = paymentMethod === 'cod' || (paymentMethod === 'bank' && receiptFile !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setSubmitting(true);
    
    try {
      // Collect form data
      const formData = new FormData(e.target as HTMLFormElement);
      const customer = `${formData.get('firstName')} ${formData.get('lastName')}`;
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const street = formData.get('address') as string;
      const city = formData.get('city') as string;
      const postalCode = formData.get('postalCode') as string;
      const address = [street, city, postalCode].filter(Boolean).join(', ');
      
      let receiptImage = null;
      if (receiptFile) {
        receiptImage = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(receiptFile);
        });
      }

      const orderData = {
        customerId: user?.uid || null,
        customerEmail: user?.email || email,
        customer,
        phone,
        email,
        address,
        total: `LKR ${total.toLocaleString('en-LK')}`,
        payment: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
        items: items,
        receiptImage: receiptImage,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customer)}&backgroundColor=6B2335&textColor=ffffff`
      };

      const { createOrderAction } = await import('@/app/actions/checkout');
      const result = await createOrderAction(orderData);
      
      if (result.success) {
        clearCart();
        setShowSuccessModal(true);
      } else {
        console.error(result.error);
        try {
          const parsedErrors = JSON.parse(result.error);
          if (Array.isArray(parsedErrors) && parsedErrors.length > 0) {
            toast.error(parsedErrors[0].message || 'Validation failed. Please check your inputs.');
          } else {
            toast.error(result.error || 'Failed to place order. Please try again.');
          }
        } catch {
          toast.error(result.error || 'Failed to place order. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  const defaultAddr = user?.addresses?.find((a: any) => a.isDefault) || user?.addresses?.[0];
  const defaultFirstName = defaultAddr?.name?.split(' ')[0] || user?.name?.split(' ')[0] || '';
  const defaultLastName = defaultAddr?.name?.split(' ').slice(1).join(' ') || user?.name?.split(' ').slice(1).join(' ') || '';
  const defaultPhone = defaultAddr?.phone || user?.phone || '';
  const defaultStreet = defaultAddr?.street || user?.address || '';
  const defaultCity = defaultAddr?.city || '';

  return (
    <div className={styles.wrapper}>
      <div className={styles.formSection}>
        <form id="checkout-form" onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" defaultValue={user?.email} required placeholder="your@email.com" />
              </div>
              <div className={styles.inputCol}>
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" defaultValue={defaultPhone} required placeholder="07X XXX XXXX" />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>
            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" defaultValue={defaultFirstName} required placeholder="First Name" />
              </div>
              <div className={styles.inputCol}>
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" defaultValue={defaultLastName} required placeholder="Last Name" />
              </div>
            </div>
            
            <div className={styles.inputCol}>
              <label htmlFor="address">Delivery Address *</label>
              <input type="text" id="address" name="address" defaultValue={defaultStreet} required placeholder="House No, Street" />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <label htmlFor="city">Town / City *</label>
                <input type="text" id="city" name="city" defaultValue={defaultCity} required />
              </div>
              <div className={styles.inputCol}>
                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" id="postalCode" name="postalCode" />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            
            <div className={styles.paymentMethods}>
              <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.activePayment : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div className={styles.paymentDetails}>
                  <span className={styles.paymentName}>Cash on Delivery</span>
                  <span className={styles.paymentDesc}>Pay with cash upon delivery.</span>
                </div>
              </label>

              <label className={`${styles.paymentOption} ${paymentMethod === 'bank' ? styles.activePayment : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                />
                <div className={styles.paymentDetails}>
                  <span className={styles.paymentName}>Bank Transfer</span>
                  <span className={styles.paymentDesc}>Transfer directly to our bank account.</span>
                </div>
              </label>

              {paymentMethod === 'bank' && (
                <div className={styles.bankDetails}>
                  {paymentSettings?.bankAccounts?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                      {paymentSettings.bankAccounts.map((bank: any, idx: number) => (
                        <div key={idx} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
                          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Bank:</strong> {bank.bankName}</p>
                          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Account Name:</strong> {bank.accountName}</p>
                          <p style={{ margin: '0 0 0.5rem 0' }}><strong>Account Number:</strong> {bank.accountNumber}</p>
                          <p style={{ margin: 0 }}><strong>Branch:</strong> {bank.branch}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb', marginBottom: '1rem' }}>
                      <p><strong>Bank:</strong> Commercial Bank</p>
                      <p><strong>Account Name:</strong> Fashion Gallery Apparel</p>
                      <p><strong>Account Number:</strong> 1000 2345 6789</p>
                      <p><strong>Branch:</strong> Moratuwa</p>
                    </div>
                  )}
                  <p className={styles.bankNote}>
                    Please deposit the total amount to the account above. Your order will not ship until the funds have cleared in our account.
                  </p>
                  <div className={styles.receiptUpload}>
                    <label htmlFor="receipt">Upload Payment Receipt *</label>
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*,application/pdf"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      required={paymentMethod === 'bank'}
                    />
                    {receiptFile && <span className={styles.fileName}>{receiptFile.name}</span>}
                  </div>
                </div>
              )}

              <label className={`${styles.paymentOption} ${styles.disabledPayment}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  disabled
                />
                <div className={styles.paymentDetails}>
                  <span className={styles.paymentName}>Credit / Debit Card (Coming Soon)</span>
                  <span className={styles.paymentDesc}>Secure online payment via card.</span>
                </div>
              </label>
            </div>
          </div>

        </form>
      </div>

      {/* ──── ORDER SUMMARY ──── */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Your Order</h2>
          
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemImageWrap}>
                  <Image src={item.product.image || '/logo.svg'} alt={item.product.name} fill sizes="60px" className={styles.itemImage} />
                  <span className={styles.itemBadge}>{item.qty}</span>
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.product.name}</span>
                  <span className={styles.itemVariant}>{item.color} / {item.size}</span>
                </div>
                <div className={styles.itemPrice}>
                  LKR {(item.product.price * item.qty).toLocaleString('en-LK')}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString('en-LK')}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Delivery</span>
              <span>LKR {deliveryFee.toLocaleString('en-LK')}</span>
            </div>
            <div className={styles.grandTotal}>
              <span>Total</span>
              <span>LKR {total.toLocaleString('en-LK')}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={submitting || !isFormValid}
          >
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Order Placed Successfully!</h2>
            <p className={styles.modalDesc}>
              Thank you for your purchase. Your order has been received and is being processed. 
              {paymentMethod === 'bank' && ' We will check your payment receipt and confirm your order shortly.'}
            </p>
            <button 
              className={`btn btn-primary ${styles.continueBtn}`}
              onClick={() => router.push('/')}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
