import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

const TRUST_BADGES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Island-wide Delivery',
    subtitle: 'Fast & reliable delivery',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Cash on Delivery',
    subtitle: 'Pay when you receive',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Secure Payments',
    subtitle: '100% safe & secure',
  },
];

export default function Hero() {
  return (
    <section className={styles.hero} id="hero-section">
      <div className={`container ${styles.inner}`}>
        {/* Left Content */}
        <div className={styles.content}>
          <span className={styles.eyebrow}>Timeless Fashion for Confident Women</span>

          <h1 className={styles.heading}>
            Elevate Your Style<br />
            With{' '}
            <em className={styles.headingItalic}>Timeless Fashion</em>
          </h1>

          <p className={styles.description}>
            Discover elegant dresses, office wear and new arrivals designed just for you.
          </p>

          <div className={styles.ctas}>
            <Link href="/new-arrivals" className={`btn btn-primary ${styles.ctaPrimary}`} id="hero-cta-arrivals">
              Shop New Arrivals
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <a
              href="https://wa.me/94764165908?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-whatsapp ${styles.ctaWhatsapp}`}
              id="hero-cta-whatsapp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Order
            </a>
          </div>

          {/* Trust Badges */}
          <div className={styles.trustRow}>
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className={styles.trustBadge}>
                <span className={styles.trustIcon}>{badge.icon}</span>
                <div>
                  <p className={styles.trustTitle}>{badge.title}</p>
                  <p className={styles.trustSub}>{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBg} />
          <Image
            src="/hero-banner.png"
            alt="Fashion Gallery Apparel — Timeless Women's Fashion"
            width={680}
            height={580}
            priority
            className={styles.heroImage}
          />
          {/* Floating badge */}
          <div className={styles.floatingBadge}>
            <span className={styles.floatingBadgeNum}>9.4K+</span>
            <span className={styles.floatingBadgeTxt}>Happy Customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
