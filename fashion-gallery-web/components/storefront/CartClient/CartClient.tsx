'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import styles from './CartClient.module.css';

// No more mock data needed here.

export default function CartClient({ deliverySettings }: { deliverySettings?: any }) {
  const [mounted, setMounted] = useState(false);
  const { items, updateQty, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const subtotal = getSubtotal();
  
  let deliveryFee = 0;
  if (subtotal > 0) {
    deliveryFee = deliverySettings?.standardDeliveryCharge || 350;
  }

  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/dresses" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* ──── CART ITEMS ──── */}
      <div className={styles.itemsColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.colProduct}>Product</div>
          <div className={styles.colQty}>Quantity</div>
          <div className={styles.colTotal}>Total</div>
        </div>

        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              {/* Product Info */}
              <div className={styles.itemProduct}>
                <Link href={`/product/${item.product.slug}`} className={styles.itemImageWrap}>
                  <Image src={item.product.image || '/logo.svg'} alt={item.product.name} fill sizes="80px" className={styles.itemImage} />
                </Link>
                <div className={styles.itemDetails}>
                  <Link href={`/product/${item.product.slug}`} className={styles.itemName}>
                    {item.product.name}
                  </Link>
                  <p className={styles.itemVariant}>Color: {item.color} | Size: {item.size}</p>
                  <p className={styles.itemPrice}>LKR {item.product.price.toLocaleString('en-LK')}</p>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>

              {/* Qty */}
              <div className={styles.itemQty}>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
              </div>

              {/* Total */}
              <div className={styles.itemTotal}>
                LKR {(item.product.price * item.qty).toLocaleString('en-LK')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──── ORDER SUMMARY ──── */}
      <div className={styles.summaryColumn}>
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>LKR {subtotal.toLocaleString('en-LK')}</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Delivery Fee</span>
            <span>LKR {deliveryFee.toLocaleString('en-LK')}</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>LKR {total.toLocaleString('en-LK')}</span>
          </div>

          <p className={styles.taxNote}>Taxes included. Delivery calculated here.</p>

          <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`}>
            Proceed to Checkout
          </Link>
          
          <Link href="/dresses" className={styles.continueLink}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
