import Link from 'next/link';
import { getAdminDb } from '@/lib/firebase/admin';
import styles from './PromoBanner.module.css';

const DEFAULT = {
  enabled: true,
  tag: 'Limited Time Offer',
  title: 'Summer Sale',
  subtitle: "Up to 40% Off on selected dresses — shop our finest collection before it sells out.",
  primaryBtnText: 'Shop Now',
  primaryBtnLink: '/dresses',
  secondaryBtnText: 'New Arrivals',
  secondaryBtnLink: '/new-arrivals',
};

export default async function PromoBanner() {
  let bannerData = DEFAULT;

  try {
    const db = getAdminDb();
    const snap = await db.collection('settings').doc('promo_banner').get();
    if (snap.exists) {
      bannerData = { ...DEFAULT, ...snap.data() };
    }
  } catch (e) {
    console.error('PromoBanner fetch error:', e);
  }

  if (!bannerData.enabled) return null;

  return (
    <section className={styles.banner} id="promo-banner">
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.tag}>{bannerData.tag}</p>
        <h2 className={styles.title}>{bannerData.title}</h2>
        <p
          className={styles.subtitle}
          dangerouslySetInnerHTML={{ __html: bannerData.subtitle }}
        />
        <div className={styles.actions}>
          <Link href={bannerData.primaryBtnLink} className={styles.btnPrimary} id="promo-shop-now">
            {bannerData.primaryBtnText}
          </Link>
          <Link href={bannerData.secondaryBtnLink} className={styles.btnSecondary} id="promo-new-arrivals">
            {bannerData.secondaryBtnText}
          </Link>
        </div>
      </div>
    </section>
  );
}
