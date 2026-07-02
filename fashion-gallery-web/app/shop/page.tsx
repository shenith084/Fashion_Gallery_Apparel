import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';
import styles from './shop.module.css';

export const metadata: Metadata = {
  title: 'Shop All Dresses | Fashion Gallery Apparel',
  description: 'Browse our full collection of elegant women\'s dresses — maxi, midi, office wear and more. Island-wide delivery across Sri Lanka.',
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <div className={styles.pageHero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <span>Shop</span>
          </nav>
          <h1 className={styles.pageTitle}>Our Collection</h1>
          <p className={styles.pageDesc}>Discover elegant dresses crafted for confident women</p>
        </div>
      </div>

      <div className="container">
        <ShopClient />
      </div>
      <Footer />
    </>
  );
}
