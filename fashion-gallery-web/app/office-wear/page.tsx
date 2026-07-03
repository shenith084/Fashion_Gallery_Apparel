import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import OfficeWearHero from '@/components/storefront/OfficeWearHero/OfficeWearHero';
import ShopClient from '@/components/storefront/ShopClient/ShopClient';
import InfoBar from '@/components/storefront/InfoBar';

export const metadata = { title: 'Office Wear | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <OfficeWearHero />
      <div className="container" style={{ paddingTop: '32px' }}>
        <ShopClient initialCategory="office-wear" columns={3} />
      </div>
      <InfoBar />
      <Footer />
    </>
  );
}