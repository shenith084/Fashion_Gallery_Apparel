import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import styles from './NewArrivals.module.css';
import { getAdminDb } from '@/lib/firebase/admin';

export default async function NewArrivals() {
  let newArrivals: any[] = [];
  try {
    const db = getAdminDb();
    // Fetch latest 4 active products directly using Admin SDK (bypasses security rules for server components)
    const snapshot = await db.collection('products')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
      
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'Active' && data.category === 'New Arrivals' && newArrivals.length < 5) {
        newArrivals.push({ id: doc.id, href: `/product/${data.slug || doc.id}`, ...data });
      }
    });
  } catch (error) {
    console.error("Error reading from Firestore:", error);
  }

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
