import { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/storefront/Navbar';
import Hero from '@/components/storefront/Hero';
import InfoBar from '@/components/storefront/InfoBar';
import ShopByCategory from '@/components/storefront/ShopByCategory';
import NewArrivals from '@/components/storefront/NewArrivals';
import LatestFashionVideos from '@/components/storefront/LatestFashionVideos';
import PromoBanner from '@/components/storefront/PromoBanner';
import Newsletter from '@/components/storefront/Newsletter';
import Footer from '@/components/storefront/Footer';
import { HeroSkeleton, ProductGridSkeleton, VideoGallerySkeleton } from '@/components/ui/Skeletons';

// Cache the homepage for 60 seconds to significantly boost TTFB performance.
// React Suspense will handle components that fetch dynamic data inside.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Fashion Gallery Apparel | My Moon Clothing — Elegant Women\'s Dresses Sri Lanka',
  description:
    'Discover timeless women\'s fashion at Fashion Gallery Apparel. Maxi dresses, midi dresses, office wear & more. Island-wide cash on delivery across Sri Lanka.',
  alternates: {
    canonical: 'https://fashiongalleryapparel.lk',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Fashion Gallery Apparel | My Moon Clothing',
    image: 'https://fashiongalleryapparel.lk/logo.svg',
    '@id': 'https://fashiongalleryapparel.lk',
    url: 'https://fashiongalleryapparel.lk',
    telephone: '+94770414075',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No 302, De Mel Road',
      addressLocality: 'Moratuwa',
      addressRegion: 'Western Province',
      postalCode: '10400',
      addressCountry: 'LK'
    },
    priceRange: '$$'
  };

  return (
    <main>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <InfoBar />
      <ShopByCategory />
      <Suspense fallback={
        <section className="container" style={{ padding: '80px 0' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>NEW ARRIVALS</h2>
          <ProductGridSkeleton count={4} columns={4} />
        </section>
      }>
        <NewArrivals />
      </Suspense>
      <PromoBanner />
      <Suspense fallback={
        <section className="container" style={{ padding: '80px 0' }}>
          <h2 style={{ marginBottom: '32px' }}>LATEST FASHION VIDEOS</h2>
          <VideoGallerySkeleton />
        </section>
      }>
        <LatestFashionVideos />
      </Suspense>
      <Newsletter />
      <Footer />
    </main>
  );
}
