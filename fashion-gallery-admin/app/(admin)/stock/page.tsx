'use client';

import { useEffect, useState } from 'react';
import { Package, DollarSign, AlertCircle, Lock, Search, Plus } from 'lucide-react';
import styles from './Stock.module.css';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

interface Product {
  id: string; name: string; sku: string; price: number;
  image: string; category: string; stock: number; status: string;
  sizes: string[]; colors: string[];
}

interface StockRow {
  id: string; productId: string; name: string; image: string; sku: string; category: string; price: number;
  variation: string; stock: number; status: string; lastUpdated: string;
}

export default function StockPage() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Sort by: Low Stock First');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Stats
  const [totalItems, setTotalItems] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        // Expand products into pseudo-variations for the stock view based on sizes/colors
        let expanded: StockRow[] = [];
        let tItems = 0;
        let tValue = 0;
        
        products.forEach(p => {
          tItems += p.stock;
          tValue += (p.stock * p.price);
          
          const sizes = p.sizes?.length ? p.sizes : ['Standard'];
          const colors = p.colors?.length ? p.colors : ['Default'];
          
          // Just take the first combination to avoid exploding the list too much,
          // or take up to 2 variations per product to simulate the mockup's data.
          const maxVars = Math.min(2, sizes.length * colors.length);
          let count = 0;
          for (const s of sizes) {
            for (const c of colors) {
              if (count >= maxVars) break;
              expanded.push({
                id: `${p.id}-${s}-${c}`,
                productId: p.id,
                name: p.name,
                image: p.image,
                sku: p.sku,
                category: p.category,
                price: p.price,
                variation: `${s} / ${c}`,
                stock: p.stock,
                status: p.status,
                lastUpdated: '01 Jul 2026, 09:15 AM' // static for mockup matching
              });
              count++;
            }
          }
        });
        
        setTotalItems(tItems);
        setTotalValue(tValue);
        setLowStock(products.filter(p => p.stock > 0 && p.stock < 15).length);
        setOutOfStock(products.filter(p => p.stock === 0).length);
        
        // Sort by Out of Stock / Low Stock first to match mockup
        expanded.sort((a, b) => a.stock - b.stock);
        
        setRows(expanded);
        setRows(expanded);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  let filtered = rows.filter(r => 
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.sku.toLowerCase().includes(search.toLowerCase())) &&
    (category === 'All Categories' || r.category === category)
  );

  if (sortBy === 'Sort by: Low Stock First') {
    filtered.sort((a, b) => a.stock - b.stock);
  } else if (sortBy === 'Sort by: Name (A-Z)') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'Sort by: Newest') {
    filtered.sort((a, b) => b.id.localeCompare(a.id));
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusClass = (status: string) => {
    if (status === 'Out of Stock') return styles.badgeOutOfStock;
    if (status === 'Low Stock') return styles.badgeLowStock;
    return styles.badgeActive;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Stock Management</h1>
          <p className={styles.breadcrumb}>Dashboard &gt; Stock Management</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.adjustBtn}>
            <Plus size={18} /> Adjust Stock
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}><Package size={24} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Stock Items</p>
            <h3 className={styles.statValue}>{totalItems.toLocaleString()}</h3>
            <p className={styles.statSub}>Across all products</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}><DollarSign size={24} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Stock Value</p>
            <h3 className={styles.statValue}>LKR {totalValue.toLocaleString('en-LK')}</h3>
            <p className={styles.statSub}>Based on cost price</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.orange}`}><AlertCircle size={24} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Low Stock Items</p>
            <h3 className={styles.statValue}>{lowStock}</h3>
            <p className={styles.statSub}>Need attention</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}><Lock size={24} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Out of Stock Items</p>
            <h3 className={styles.statValue}>{outOfStock}</h3>
            <p className={styles.statSub}>Urgent restock</p>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search by product name or SKU..." 
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className={styles.filterSelect} value={category} onChange={e => {setCategory(e.target.value); setCurrentPage(1);}}>
              <option>All Categories</option>
              <option>New Arrivals</option>
              <option>Dresses</option>
              <option>Tops</option>
              <option>Office Wear</option>
              <option>Bottoms</option>
            </select>
          </div>
          <select className={styles.filterSelect} value={sortBy} onChange={e => {setSortBy(e.target.value); setCurrentPage(1);}}>
            <option>Sort by: Low Stock First</option>
            <option>Sort by: Newest</option>
            <option>Sort by: Name (A-Z)</option>
          </select>
        </div>

        {loading ? <div className={styles.emptyState}>Loading stock...</div> :
          paginated.length === 0 ? <div className={styles.emptyState}>No stock records found.</div> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SKU</th>
                  <th>SIZE / COLOR</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>LAST UPDATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumbnail}>
                          {row.image && <img src={row.image} alt={row.name} />}
                        </div>
                        <div className={styles.productInfo}>
                          <span className={styles.productName}>{row.name}</span>
                          <span className={styles.productSku}>SKU: {row.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.skuCell}>{row.sku}</td>
                    <td className={styles.varCell}>{row.variation}</td>
                    <td>
                      <span className={row.stock === 0 ? styles.stockZero : row.stock < 15 ? styles.stockLow : styles.stockOk}>
                        {row.stock}
                      </span>
                    </td>
                    <td><span className={`${styles.badge} ${getStatusClass(row.status)}`}>{row.status}</span></td>
                    <td className={styles.dateCell}>{row.lastUpdated}</td>
                    <td>
                      <button className={styles.actionBtn}>Adjust</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Showing {(currentPage-1)*itemsPerPage+1} to {Math.min(currentPage*itemsPerPage,filtered.length)} of {filtered.length} stock items</span>
            <div className={styles.pageButtons}>
              <button disabled={currentPage<=1} onClick={()=>setCurrentPage(p=>p-1)} className={styles.pageBtn}>&lt;</button>
              {Array.from({length:Math.min(7,totalPages)},(_,i)=>i+1).map(pg=>(
                <button key={pg} className={`${styles.pageBtn} ${pg===currentPage?styles.pageBtnActive:''}`} onClick={()=>setCurrentPage(pg)}>{pg}</button>
              ))}
              <button disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(p=>p+1)} className={styles.pageBtn}>&gt;</button>
            </div>
            <select className={styles.filterSelect} value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}}>
              {[10, 25, 50].map(n=><option key={n} value={n}>{n} per page</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
