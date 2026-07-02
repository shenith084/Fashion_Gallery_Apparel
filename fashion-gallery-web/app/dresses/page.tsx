import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';

export const metadata = { title: 'All Dresses | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--color-soft-beige)', padding: 'var(--space-12) 0 var(--space-8)', textAlign: 'center', borderBottom: '1px solid rgba(107, 35, 53, 0.08)' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-charcoal)' }}>All Dresses</h1>
        </div>
      </div>
      <div className="container">
        <ShopClient initialCategory="all" />
      </div>
      <Footer />
    </>
  );
}