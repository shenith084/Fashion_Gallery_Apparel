'use client';

import { useEffect, useState } from 'react';
import { Package, DollarSign, AlertCircle, Lock, Search, Plus } from 'lucide-react';
import styles from './Stock.module.css';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

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

  // Modal State
  const [selectedRow, setSelectedRow] = useState<StockRow | null>(null);
  const [newStockValue, setNewStockValue] = useState<string | number>('');
  const [isSavingStock, setIsSavingStock] = useState(false);

  useEffect(() => {
    if (selectedRow) {
      setNewStockValue(selectedRow.stock);
    }
  }, [selectedRow]);

  const handleSaveStock = async () => {
    if (!selectedRow) return;
    setIsSavingStock(true);
    try {
      const stockNum = parseInt(newStockValue as string, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        toast.error('Invalid stock quantity');
        return;
      }
      
      const productRef = doc(db, 'products', selectedRow.productId);
      const newStatus = stockNum === 0 ? 'Out of Stock' : (stockNum < 15 ? 'Low Stock' : 'Active');
      
      await updateDoc(productRef, {
        stock: stockNum,
        status: newStatus
      });
      
      toast.success('Stock adjusted successfully!');
      
      // Update local state without fetching again to feel fast
      setRows(prev => prev.map(r => r.productId === selectedRow.productId ? {
        ...r, 
        stock: stockNum,
        status: newStatus
      } : r));
      
      setSelectedRow(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to adjust stock');
    } finally {
      setIsSavingStock(false);
    }
  };

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        let expanded: StockRow[] = [];
        let tItems = 0;
        let tValue = 0;
        
        products.forEach(p => {
          tItems += p.stock;
          tValue += (p.stock * p.price);
          
          const sizes = p.sizes?.length ? p.sizes.join(', ') : 'Standard';
          const colors = p.colors?.length ? p.colors.join(', ') : 'Default';
          
          expanded.push({
            id: p.id,
            productId: p.id,
            name: p.name,
            image: p.image,
            sku: p.sku || '',
            category: p.category,
            price: p.price,
            variation: `${sizes} / ${colors}`,
            stock: p.stock,
            status: p.status,
            lastUpdated: '01 Jul 2026, 09:15 AM' // static for mockup matching
          });
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
    ((r.name || '').toLowerCase().includes(search.toLowerCase()) || (r.sku || '').toLowerCase().includes(search.toLowerCase())) &&
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
                      <button className={styles.actionBtn} onClick={() => setSelectedRow(row)}>Adjust</button>
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

      {selectedRow && (
        <div className={styles.modalOverlay} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.modalContent} style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Adjust Stock</h3>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563' }}>Product: <strong>{selectedRow.name}</strong></p>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4b5563' }}>SKU: <strong>{selectedRow.sku}</strong></p>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>New Stock Quantity</label>
              <input 
                type="number" 
                value={newStockValue} 
                onChange={e => setNewStockValue(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                min="0"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setSelectedRow(null)} 
                style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStock}
                disabled={isSavingStock}
                style={{ padding: '8px 16px', background: 'var(--color-burgundy)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              >
                {isSavingStock ? 'Saving...' : 'Save Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
