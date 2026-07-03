import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ContactLayout from '@/components/storefront/Contact/ContactLayout';
import ContactMap from '@/components/storefront/Contact/ContactMap';

export const metadata = { title: 'Contact Us | Fashion Gallery Apparel' };

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactLayout />
        <ContactMap />
      </main>
      <Footer />
    </>
  );
}