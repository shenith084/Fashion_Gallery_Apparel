import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import styles from './NewArrivals.module.css';

const NEW_ARRIVALS = [
  { id: 'floral-maxi', name: 'Floral Maxi Dress', price: 4990, image: '/prod-floral-maxi.png', rating: 4, reviewCount: 128, isNew: true, href: '/product/floral-maxi-dress' },
  { id: 'wrap-midi', name: 'Wrap Midi Dress', price: 4490, image: '/prod-wrap-midi.png', rating: 4.5, reviewCount: 84, isNew: true, href: '/product/wrap-midi-dress' },
  { id: 'printed-long', name: 'Printed Long Dress', price: 4790, image: '/prod-printed-long.png', rating: 4, reviewCount: 87, isNew: true, href: '/product/printed-long-dress' },
  { id: 'vneck-midi', name: 'V-Neck Midi Dress', price: 4290, image: '/prod-vneck.png', rating: 4, reviewCount: 74, isNew: true, href: '/product/vneck-midi-dress' },
  { id: 'shirt-dress', name: 'Shirt Dress', price: 4290, image: '/prod-shirt.png', rating: 4, reviewCount: 51, isNew: true, href: '/product/shirt-dress' },
  { id: 'office-dress', name: 'Office Wear Dress', price: 4290, image: '/prod-office.png', rating: 4, reviewCount: 63, isNew: true, href: '/product/office-wear-dress' },
];

export default function NewArrivals() {
  return (
    <section className={styles.section} id="new-arrivals-section">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title} style={{ textTransform: 'uppercase', color: '#111', letterSpacing: '0.05em' }}>NEW ARRIVALS</h2>
          <Link href="/new-arrivals" className={styles.viewAll} id="view-all-arrivals">
            VIEW ALL
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4"/>
            </svg>
          </Link>
        </div>

        <div className={styles.grid}>
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
