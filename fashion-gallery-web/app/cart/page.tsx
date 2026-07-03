import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartClient from '@/components/storefront/CartClient';
import styles from './cart.module.css';

export const metadata: Metadata = {
  title: 'Shopping Cart | Fashion Gallery Apparel',
  description: 'Review your items and proceed to checkout.',
};

export default function CartPage() {
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
        <CartClient />
      </main>
      <Footer />
    </>
  );
}
