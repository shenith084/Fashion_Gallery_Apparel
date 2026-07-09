'use client';

import { useState } from 'react';
import WholesaleHero from './WholesaleHero';
import WholesaleFeatures from './WholesaleFeatures';
import WholesalePartner from './WholesalePartner';
import WholesaleBenefits from './WholesaleBenefits';
import WholesaleHowItWorks from './WholesaleHowItWorks';
import WholesaleApplicationModal from './WholesaleApplicationModal';

export default function WholesaleClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <main>
        <WholesaleHero openModal={() => setIsModalOpen(true)} />
        <WholesaleFeatures />
        <WholesalePartner openModal={() => setIsModalOpen(true)} />
        <WholesaleBenefits />
        <WholesaleHowItWorks />
      </main>
      <WholesaleApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
