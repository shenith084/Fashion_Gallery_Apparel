import Image from 'next/image';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Suspense } from 'react';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';
import styles from './NewArrivalsPage.module.css';

export const metadata = { title: 'New Arrivals | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <div className={styles.heroSection}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroSubtitle}>FRESH STYLES, JUST FOR YOU</p>
            <h1 className={styles.heroTitle}>New Arrivals</h1>
            <p className={styles.heroDesc}>
              Discover our latest collection of elegant dresses and office wear, designed to make you feel confident and beautiful.
            </p>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <Image
            src="/new-arrivals-hero-generated.png"
            alt="New Arrivals Fashion"
            fill
            className={styles.heroImage}
            priority
          />
        </div>
      </div>
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <Suspense fallback={<div style={{textAlign:"center", padding: "4rem"}}>Loading...</div>}>
          <ShopClient initialCategory="new-arrivals" />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}