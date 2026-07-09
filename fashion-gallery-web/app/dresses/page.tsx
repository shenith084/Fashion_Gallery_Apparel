import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import DressesHero from '@/components/storefront/DressesHero/DressesHero';
import DressesCategories from '@/components/storefront/DressesCategories/DressesCategories';
import { Suspense } from 'react';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';
import InfoBar from '@/components/storefront/InfoBar';

export const metadata = { title: 'All Dresses | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <DressesHero />
      <DressesCategories />
      <div className="container">
        <Suspense fallback={<div style={{textAlign:"center", padding: "4rem"}}>Loading...</div>}>
          <ShopClient initialCategory="all" columns={3} />
        </Suspense>
      </div>
      <InfoBar />
      <Footer />
    </>
  );
}