import { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import WholesaleClient from '@/components/storefront/Wholesale/WholesaleClient';

export const metadata: Metadata = {
  title: 'Wholesale | Fashion Gallery Apparel',
  description: 'Partner with Fashion Gallery Apparel for premium women\'s clothing wholesale in Sri Lanka.',
};

export default function WholesalePage() {
  return (
    <>
      <Navbar />
      <WholesaleClient />
      <Footer />
    </>
  );
}