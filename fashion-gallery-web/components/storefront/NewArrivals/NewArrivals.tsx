import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import ProductCard from '@/components/ui/ProductCard';
import styles from './NewArrivals.module.css';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export default function NewArrivals() {
  let newArrivals: any[] = [];
  try {
    if (fs.existsSync(DB_PATH)) {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      newArrivals = (db.products || [])
        .filter((p: any) => p.isNew || p.categorySlug === 'new-arrivals')
        .slice(0, 6)
        .map((p: any) => ({ ...p, href: `/product/${p.slug}` }));
    }
  } catch {}

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
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
