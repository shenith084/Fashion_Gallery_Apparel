import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CheckoutClient from '@/components/storefront/CheckoutClient';
import styles from './checkout.module.css';

export const metadata: Metadata = {
  title: 'Checkout | Fashion Gallery Apparel',
  description: 'Complete your order.',
};

export default function CheckoutPage() {
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
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}
