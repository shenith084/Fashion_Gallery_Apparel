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
          <p className={styles.subtitle}>Explore Our</p>
          <h2 className={styles.title}>Shop By Category</h2>
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerDot} />
            <span className={styles.dividerLine} />
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
                <div className={styles.content}>
                  <h3 className={styles.label}>{cat.label}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
