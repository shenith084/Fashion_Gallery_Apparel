import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Hero from '@/components/storefront/Hero';
import InfoBar from '@/components/storefront/InfoBar';
import ShopByCategory from '@/components/storefront/ShopByCategory';
import NewArrivals from '@/components/storefront/NewArrivals';
import LatestFashionVideos from '@/components/storefront/LatestFashionVideos';
import Newsletter from '@/components/storefront/Newsletter';
import Footer from '@/components/storefront/Footer';

export const metadata: Metadata = {
  title: 'Fashion Gallery Apparel | My Moon Clothing — Elegant Women\'s Dresses Sri Lanka',
  description:
    'Discover timeless women\'s fashion at Fashion Gallery Apparel. Maxi dresses, midi dresses, office wear & more. Island-wide cash on delivery across Sri Lanka.',
  alternates: {
    canonical: 'https://fashiongalleryapparel.lk',
  },
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <InfoBar />
      <ShopByCategory />
      <NewArrivals />
      <LatestFashionVideos />
      <Newsletter />
      <Footer />
    </main>
  );
}
