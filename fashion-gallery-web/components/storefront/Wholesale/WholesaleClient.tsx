'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import WholesaleHero from './WholesaleHero';
import WholesaleFeatures from './WholesaleFeatures';
import WholesalePartner from './WholesalePartner';
import WholesaleBenefits from './WholesaleBenefits';
import WholesaleHowItWorks from './WholesaleHowItWorks';
import WholesaleApplicationModal from './WholesaleApplicationModal';

export default function WholesaleClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  
  const handleOpenModal = () => {
    if (!user) {
      toast.error('Please login to apply for wholesale');
      router.push('/login?redirect=/wholesale');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <main>
        <WholesaleHero openModal={handleOpenModal} />
        <WholesaleFeatures />
        <WholesalePartner openModal={handleOpenModal} />
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
