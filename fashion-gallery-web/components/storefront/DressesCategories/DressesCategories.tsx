import Link from 'next/link';
import Image from 'next/image';
import styles from './DressesCategories.module.css';

const CATEGORIES = [
  {
    id: 'maxi',
    title: 'MAXI DRESSES',
    image: '/cat-maxi.png',
    href: '/dresses?category=maxi',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 3H14L16 9L18 21H6L8 9L10 3Z"/>
        <path d="M8 9H16"/>
        <path d="M12 3V9"/>
      </svg>
    )
  },
  {
    id: 'midi',
    title: 'MIDI DRESSES',
    image: '/cat-midi.png',
    href: '/dresses?category=midi',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 4H15L17 11L16 18H8L7 11L9 4Z"/>
        <path d="M7 11H17"/>
      </svg>
    )
  },
  {
    id: 'party',
    title: 'PARTY DRESSES',
    image: '/cat-office.png', // Fallback image that looks elegant
    href: '/dresses?category=party',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15 9L22 10L17 15L18.5 22L12 18.5L5.5 22L7 15L2 10L9 9L12 2Z"/>
      </svg>
    )
  },
  {
    id: 'casual',
    title: 'CASUAL DRESSES',
    image: '/cat-best.png', // Fallback image
    href: '/dresses?category=casual',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 5H16L18 12H6L8 5Z"/>
        <path d="M6 12V20H18V12"/>
        <path d="M12 5V20"/>
      </svg>
    )
  }
];

export default function DressesCategories() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={cat.href} className={styles.card}>
            <Image src={cat.image} alt={cat.title} fill className={styles.image} />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <div className={styles.icon}>{cat.icon}</div>
              <div className={styles.textWrap}>
                <h3 className={styles.title}>{cat.title}</h3>
                <span className={styles.explore}>Explore Now</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
