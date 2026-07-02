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
      <div className={styles.pageHero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <span>Cart</span>
          </nav>
          <h1 className={styles.pageTitle}>Your Cart</h1>
        </div>
      </div>

      <main className="container">
        <CartClient />
      </main>
      <Footer />
    </>
  );
}
