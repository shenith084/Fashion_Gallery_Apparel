import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import AboutHero from '@/components/storefront/About/AboutHero';
import AboutStory from '@/components/storefront/About/AboutStory';
import AboutValues from '@/components/storefront/About/AboutValues';
import AboutStats from '@/components/storefront/About/AboutStats';
import AboutFeatures from '@/components/storefront/About/AboutFeatures';
import AboutPromise from '@/components/storefront/About/AboutPromise';

export const metadata = { title: 'About Us | Fashion Gallery Apparel' };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutStats />
        <AboutFeatures />
        <AboutPromise />
      </main>
      <Footer />
    </>
  );
}