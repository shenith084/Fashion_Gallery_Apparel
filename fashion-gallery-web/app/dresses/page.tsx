import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import DressesHero from '@/components/storefront/DressesHero/DressesHero';
import DressesCategories from '@/components/storefront/DressesCategories/DressesCategories';
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
        <ShopClient initialCategory="all" columns={3} />
      </div>
      <InfoBar />
      <Footer />
    </>
  );
}