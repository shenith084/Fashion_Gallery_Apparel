import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';
import { ProductGridSkeleton } from '@/components/ui/Skeletons';
import styles from './shop.module.css';

export const metadata: Metadata = {
  title: 'Shop All Dresses | Fashion Gallery Apparel',
  description: 'Browse our full collection of elegant women\'s dresses — maxi, midi, office wear and more. Island-wide delivery across Sri Lanka.',
};

export default function ShopPage() {
  return (
    <>
      <Navbar />


      <div className="container">
        <Suspense fallback={<ProductGridSkeleton count={8} columns={3} />}>
          <Suspense fallback={<div style={{textAlign:"center", padding: "4rem"}}>Loading...</div>}>
          <ShopClient />
        </Suspense>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
