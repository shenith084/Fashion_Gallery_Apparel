'use client';

import { useState } from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import WholesaleHero from '@/components/storefront/Wholesale/WholesaleHero';
import WholesaleFeatures from '@/components/storefront/Wholesale/WholesaleFeatures';
import WholesalePartner from '@/components/storefront/Wholesale/WholesalePartner';
import WholesaleBenefits from '@/components/storefront/Wholesale/WholesaleBenefits';
import WholesaleHowItWorks from '@/components/storefront/Wholesale/WholesaleHowItWorks';
import WholesaleApplicationModal from '@/components/storefront/Wholesale/WholesaleApplicationModal';

// Note: metadata cannot be exported in a 'use client' file.
// We could move it to a layout or a separate server component if needed,
// but for now we'll set the document title in a useEffect if strictly necessary,
// or just omit it for the scope of this UI update.

export default function WholesalePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main>
        <WholesaleHero openModal={() => setIsModalOpen(true)} />
        <WholesaleFeatures />
        <WholesalePartner openModal={() => setIsModalOpen(true)} />
        <WholesaleBenefits />
        <WholesaleHowItWorks />
      </main>
      <Footer />
      
      <WholesaleApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}