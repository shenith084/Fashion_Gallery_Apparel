'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/data/products';
import styles from './CheckoutClient.module.css';

const MOCK_CART = [
  { id: 'item-1', product: PRODUCTS[0], size: 'M', color: 'Pink Floral', qty: 1 },
  { id: 'item-2', product: PRODUCTS[1], size: 'L', color: 'Dusty Rose', qty: 2 },
];

export default function CheckoutClient() {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = MOCK_CART.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee = 350;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Order Placed Successfully! (This is a demo)');
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formSection}>
        <form id="checkout-form" onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" required placeholder="your@email.com" />
              </div>
              <div className={styles.inputCol}>
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" required placeholder="07X XXX XXXX" />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>
            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" required />
              </div>
              <div className={styles.inputCol}>
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" required />
              </div>
            </div>
            
            <div className={styles.inputCol}>
              <label htmlFor="address">Street Address *</label>
              <input type="text" id="address" required placeholder="House number and street name" />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputCol}>
                <label htmlFor="city">Town / City *</label>
                <input type="text" id="city" required />
              </div>
              <div className={styles.inputCol}>
                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" id="postalCode" />
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
            </div>

            {paymentMethod === 'bank' && (
              <div className={styles.bankDetails}>
                <p><strong>Bank:</strong> Commercial Bank</p>
                <p><strong>Account Name:</strong> Fashion Gallery Apparel</p>
                <p><strong>Account Number:</strong> 1000 2345 6789</p>
                <p><strong>Branch:</strong> Moratuwa</p>
                <p className={styles.bankNote}>
                  Please deposit the total amount to the account above. Your order will not ship until the funds have cleared in our account. We will contact you via WhatsApp for the deposit slip.
                </p>
              </div>
            )}
          </div>

        </form>
      </div>

      {/* ──── ORDER SUMMARY ──── */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Your Order</h2>
          
          <div className={styles.itemsList}>
            {MOCK_CART.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <div className={styles.itemImageWrap}>
                  <Image src={item.product.image} alt={item.product.name} fill sizes="60px" className={styles.itemImage} />
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
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
