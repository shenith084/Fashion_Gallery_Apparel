import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Suspense } from 'react';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';

export const metadata = { title: 'Maxi Dresses | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--color-soft-beige)', padding: 'var(--space-12) 0 var(--space-8)', textAlign: 'center', borderBottom: '1px solid rgba(107, 35, 53, 0.08)' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-charcoal)' }}>Maxi Dresses</h1>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<div style={{textAlign:"center", padding: "4rem"}}>Loading...</div>}>
          <ShopClient initialCategory="maxi-dresses" />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}