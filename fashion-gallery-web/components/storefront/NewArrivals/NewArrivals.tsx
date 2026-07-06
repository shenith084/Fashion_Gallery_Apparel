import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import styles from './NewArrivals.module.css';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function NewArrivals() {
  let products: any[] = [];
  try {
    // Firestore rules require the query to match the rule filters (Rules are not filters)
    const q = query(collection(db, 'products'), where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error reading from Firestore:", error);
  }
  
  // Get latest 4 active products
  const activeProducts = products.filter(p => p.status === 'Active');
  const newArrivals = activeProducts
    .slice(-4)
    .reverse()
    .map(p => ({ ...p, href: `/product/${p.slug}` }));

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
