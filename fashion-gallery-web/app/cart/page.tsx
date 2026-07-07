import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartClient from '@/components/storefront/CartClient';
import styles from './cart.module.css';
import { getAdminDb } from '@/lib/firebase/admin';

export const metadata: Metadata = {
  title: 'Shopping Cart | Fashion Gallery Apparel',
  description: 'Review your items and proceed to checkout.',
};

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  let deliverySettings = null;
  try {
    const adminDb = getAdminDb();
    const docSnap = await adminDb.collection('settings').doc('delivery').get();
    if (docSnap.exists) {
      deliverySettings = docSnap.data();
    }
  } catch (e) {
    console.error('Error fetching delivery settings', e);
  }

  return (
    <>
      <Navbar />
      <div className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>REVIEW YOUR ITEMS</p>
          <h1 className={styles.title}>
            Shopping <span className={styles.scriptText}>Cart</span>
          </h1>
          <div className={styles.divider}></div>
        </div>
      </div>

      <main className="container">
        <CartClient deliverySettings={deliverySettings} />
      </main>
      <Footer />
    </>
  );
}
