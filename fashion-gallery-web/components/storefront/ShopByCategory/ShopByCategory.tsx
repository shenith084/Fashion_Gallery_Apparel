import Image from 'next/image';
import Link from 'next/link';
import styles from './ShopByCategory.module.css';

const CATEGORIES = [
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    href: '/new-arrivals',
    image: '/cat-new-arrivals.png',
  },
  {
    id: 'maxi-dresses',
    label: 'Maxi Dresses',
    href: '/dresses/maxi',
    image: '/cat-maxi.png',
  },
  {
    id: 'midi-dresses',
    label: 'Midi Dresses',
    href: '/dresses/midi',
    image: '/cat-midi.png',
  },
  {
    id: 'office-wear',
    label: 'Office Wear',
    href: '/office-wear',
    image: '/cat-office.png',
  },
  {
    id: 'best-sellers',
    label: 'Best Sellers',
    href: '/best-sellers',
    image: '/cat-best.png',
  },
];

export default function ShopByCategory() {
  return (
    <section className={styles.section} id="shop-by-category">
      <div className="container">
        <div className={styles.heading}>
          <div className="section-title-line">
            <span className="section-title">Shop by Category</span>
          </div>
          <div className={styles.ornament}>
            <span />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="var(--color-rose-gold)"/>
              <circle cx="8" cy="8" r="6" stroke="var(--color-rose-gold)" strokeWidth="1" fill="none" strokeDasharray="2 2"/>
            </svg>
            <span />
          </div>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={styles.card}
              id={`category-${cat.id}`}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className={styles.image}
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.label}>{cat.label}</h3>
                <span className={styles.shopNow}>
                  Shop Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
