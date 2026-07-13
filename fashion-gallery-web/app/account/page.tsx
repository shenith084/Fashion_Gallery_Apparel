import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import Image from 'next/image';
import Link from 'next/link';
import AccountClient from '@/components/storefront/AccountClient/AccountClient';
import Newsletter from '@/components/storefront/Newsletter/Newsletter';
import styles from './account.module.css';

export const metadata = { title: 'My Profile | Fashion Gallery Apparel' };

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroContent}>
                <h1 className={styles.title}>My Profile</h1>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                  <Link href="/">Home</Link>
                  <span>›</span>
                  <span>My Profile</span>
                </nav>
              </div>
            </div>
          </div>
          
          <div className={styles.heroImageWrap}>
            <Image 
              src="/prod-wrap-midi.png" 
              alt="Profile Banner" 
              fill 
              sizes="(max-width: 768px) 50vw, 35vw"
              priority
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            />
          </div>
        </div>

        {/* Account Client */}
        <div className="container" style={{ background: '#fafafa', paddingBottom: '40px' }}>
          <AccountClient />
        </div>

        {/* Newsletter */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}