import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';

export const metadata = { title: 'Wholesale | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: 'var(--space-16) 0', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--color-burgundy)', marginBottom: 'var(--space-4)' }}>Wholesale</h1>
        <p style={{ color: 'var(--color-charcoal-light)' }}>This page is under construction. UI/UX will be provided later.</p>
      </main>
      <Footer />
    </>
  );
}