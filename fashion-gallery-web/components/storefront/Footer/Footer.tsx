import Link from 'next/link';
import styles from './Footer.module.css';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Dresses', href: '/dresses' },
  { label: 'Office Wear', href: '/office-wear' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'Contact', href: '/contact' },
];

const CUSTOMER_CARE = [
  { label: 'About Us', href: '/about' },
  { label: 'Delivery Information', href: '/policies/delivery' },
  { label: 'Return & Refund Policy', href: '/policies/returns' },
  { label: 'Terms & Conditions', href: '/policies/terms' },
  { label: 'Privacy Policy', href: '/policies/privacy' },
  { label: 'FAQ', href: '/faq' },
];

import { getAdminDb } from '@/lib/firebase/admin';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Footer() {
  noStore();
  
  const year = new Date().getFullYear();

  let settings = {
    phone: '076 416 5908',
    email: 'mymoonclothingsl@gmail.com',
    address: '186 Main St, Colombo, Western 01100',
    businessHoursMain: 'Mon – Sat: 9:00 AM – 7:00 PM',
    businessHoursWeekend: 'Sunday: 9:00 AM – 2:00 PM'
  };

  let social = {
    facebookUrl: 'https://www.facebook.com/share/1DQucw4RmB/?mibextid=wwXIfr',
    instagramUrl: 'https://www.instagram.com/fashiongalleryapparel',
    tiktokUrl: 'https://www.tiktok.com/@fashiongalleryapparel',
    whatsappUrl: '',
    youtubeUrl: '',
  };

  try {
    const adminDb = getAdminDb();
    const [contactSnap, socialSnap] = await Promise.all([
      adminDb.collection('settings').doc('contact').get(),
      adminDb.collection('settings').doc('social').get()
    ]);
    if (contactSnap.exists) {
      settings = { ...settings, ...contactSnap.data() } as any;
    }
    if (socialSnap.exists) {
      social = { ...social, ...socialSnap.data() } as any;
    }
  } catch (e) {
    console.error('Error fetching settings', e);
  }

  return (
    <footer className={styles.footer} id="site-footer">
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <div className={styles.logoMark}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="22" r="21" fill="#2B2B2B" stroke="#6B2335" strokeWidth="2"/>
                  <path d="M26 15C26 18.86 23.09 22 19.5 22C15.91 22 13 18.86 13 15C13 15 16.5 16.5 19.5 14C22.5 11.5 26 15 26 15Z" fill="white"/>
                  <path d="M18 23C18 25.76 19.79 28 22 28C24.21 28 26 25.76 26 23" stroke="#6B2335" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="22" cy="29.5" r="2" fill="#6B2335"/>
                </svg>
              </div>
              <div>
                <p className={styles.logoMain}>MY MOON</p>
                <p className={styles.logoSub}>FASHION GALLERY APPAREL</p>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Fashion Gallery Apparel (My Moon Clothing) offers elegant dresses and office wear for confident women. Island-wide cash on delivery.
            </p>
            <div className={styles.socials}>
              {social.facebookUrl && (
                <a href={social.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook" id="footer-facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                </a>
              )}
              {social.instagramUrl && (
                <a href={social.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram" id="footer-instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07m0-2.16c-3.26 0-3.67.01-4.95.07-4.36.2-6.78 2.62-6.98 6.98C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.35 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.36-2.62-6.78-6.98-6.98-1.28-.06-1.69-.07-4.95-.07z" />
                    <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4z" />
                    <circle cx="18.41" cy="5.59" r="1.44" />
                  </svg>
                </a>
              )}
              {social.tiktokUrl && (
                <a href={social.tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok" id="footer-tiktok">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.39-2.92 5.76-1.74 1.35-4.04 1.9-6.2 1.4-2.15-.49-4.06-1.85-5.2-3.71-1.12-1.8-1.4-4.04-.76-6.02.63-1.99 2.15-3.61 4.09-4.4 2.11-.87 4.54-.86 6.64-.08.01 1.47 0 2.94.02 4.41-1.23-.42-2.62-.35-3.79.23-1.17.58-2.1 1.63-2.45 2.87-.36 1.25-.13 2.66.62 3.73.74 1.07 1.99 1.73 3.3 1.83 1.32.1 2.69-.32 3.69-1.18.99-.86 1.57-2.14 1.65-3.47.16-4.66.08-9.33.13-13.99l.02-.02z" />
                  </svg>
                </a>
              )}
              {settings.phone && (
                <a href={`https://wa.me/${settings.phone.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp" id="footer-whatsapp">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className={styles.colTitle}>Customer Care</h4>
            <ul className={styles.linkList}>
              {CUSTOMER_CARE.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wholesale */}
          <div>
            <h4 className={styles.colTitle}>Wholesale Inquiries</h4>
            <p className={styles.colText}>
              Inbox us on Facebook & WhatsApp<br />
              We&apos;d love to work with you!
            </p>
            <p className={styles.wholesaleDesc}>
              Join our network of retailers. Get exclusive wholesale pricing and bulk order benefits.
            </p>
            <div className={styles.wholesaleLinks}>
              {social.facebookUrl && (
                <a href={social.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.wholesaleLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
              {settings.phone && (
                <a href={`https://wa.me/${(settings.phone || '').replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.wholesaleLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={styles.colTitle}>Contact Info</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {settings.address}
              </li>
              <li className={styles.contactItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className={styles.contactLink}>{settings.phone}</a>
              </li>
              <li className={styles.contactItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href={`mailto:${settings.email}`} className={styles.contactLink}>{settings.email}</a>
              </li>
              <li className={styles.hoursBlock}>
                <p className={styles.hoursTitle}>Business Hours</p>
                <p>{settings.businessHoursMain}</p>
                <p>{settings.businessHoursWeekend}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {year} Fashion Gallery Apparel | My Moon Clothing. All Rights Reserved.
          </p>
          <p className={styles.credit}>
            Designed with{' '}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-rose-gold)" stroke="var(--color-rose-gold)" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {' '}for confident women
          </p>
        </div>
      </div>

      {/* Back to Top */}
      <a href="#hero-section" className={styles.backToTop} aria-label="Back to top" id="back-to-top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>
        </svg>
      </a>
    </footer>
  );
}
