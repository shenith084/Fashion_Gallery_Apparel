import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CheckoutClient from '@/components/storefront/CheckoutClient';
import styles from './checkout.module.css';
import { getAdminDb } from '@/lib/firebase/admin';

export const metadata: Metadata = {
  title: 'Checkout | Fashion Gallery Apparel',
  description: 'Complete your order.',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  let paymentSettings = null;
  let deliverySettings = null;
  try {
    const adminDb = getAdminDb();
    const paymentSnap = await adminDb.collection('settings').doc('payment').get();
    if (paymentSnap.exists) {
      paymentSettings = paymentSnap.data();
    }
    const deliverySnap = await adminDb.collection('settings').doc('delivery').get();
    if (deliverySnap.exists) {
      deliverySettings = deliverySnap.data();
    }
  } catch (e) {
    console.error('Error fetching settings server-side', e);
  }

  return (
    <>
      <Navbar />
      <div className={styles.pageHero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <a href="/cart">Cart</a>
            <span>›</span>
            <span>Checkout</span>
          </nav>
          <h1 className={styles.pageTitle}>Checkout</h1>
        </div>
      </div>

      <main className="container">
        <CheckoutClient 
          initialPaymentSettings={paymentSettings} 
          deliverySettings={deliverySettings}
        />
      </main>
      <Footer />
    </>
  );
}
