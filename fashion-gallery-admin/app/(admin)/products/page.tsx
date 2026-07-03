'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';
import { useStaffStore } from '@/store/staffStore';
import { auth } from '@/lib/firebase/config';
import { Edit, Trash2, Plus, Image as ImageIcon, Search, Filter } from 'lucide-react';
import styles from './Products.module.css';

const CATEGORIES = ['All', 'new-arrivals', 'best-sellers', 'maxi-dresses', 'midi-dresses', 'office-wear'];
const STATUSES = ['All', 'active', 'draft', 'archived'];

export default function ProductsPage() {
  const { products, loading, subscribeToProducts, deleteProduct } = useProductStore();
  const { staffList, subscribeToStaff } = useStaffStore();
  const [currentUserPerms, setCurrentUserPerms] = useState<any>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const unsubProducts = subscribeToProducts();
    const unsubStaff = subscribeToStaff();
    return () => {
      unsubProducts();
      unsubStaff();
    };
  }, [subscribeToProducts, subscribeToStaff]);

  useEffect(() => {
    if (auth.currentUser && staffList.length > 0) {
      const me = staffList.find(s => s.id === auth.currentUser?.uid);
      if (me) {
        setCurrentUserPerms(me.permissions);
      }
    }
  }, [auth.currentUser, staffList]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      await deleteProduct(id);
    }
  };

  const calculateTotalStock = (stock: any[]) => {
    return stock.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Product & Stock Management</h1>
        {currentUserPerms?.['product.edit_details'] && (
          <Link href="/products/new" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        )}
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Side Filter Box */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Filter size={16} />
            <h3>Filters</h3>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Search Products</label>
            <div className={styles.searchBox}>
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Category</label>
            <div className={styles.filterList}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <div className={styles.filterList}>
              {STATUSES.map(stat => (
                <button
                  key={stat}
                  className={`${styles.filterBtn} ${selectedStatus === stat ? styles.filterBtnActive : ''}`}
                  onClick={() => setSelectedStatus(stat)}
                >
                  <span style={{ textTransform: 'capitalize' }}>{stat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Table */}
        <div className={styles.tableCol}>
          <div className={styles.tableCard}>
            {loading ? (
              <p className={styles.loading}>Loading inventory...</p>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.empty}>
                <p>No products match your filters.</p>
                {products.length === 0 && currentUserPerms?.['product.edit_details'] && (
                  <Link href="/products/new" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                    Add your first product
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Total Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className={styles.productCell}>
                          <div className={styles.thumbnail}>
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0].url} alt={product.title} />
                            ) : (
                              <ImageIcon size={20} color="var(--color-charcoal-light)" />
                            )}
                          </div>
                          <div className={styles.productInfo}>
                            <span className={styles.productTitle}>{product.title}</span>
                          </div>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{product.category.replace('-', ' ')}</td>
                        <td>Rs. {product.price.toLocaleString()}</td>
                        <td>
                          <span className={calculateTotalStock(product.stock) < 5 ? styles.textWarning : ''}>
                            {calculateTotalStock(product.stock)}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${product.status === 'active' ? styles.badgeActive : styles.badgeDraft}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className={styles.actionsCell}>
                          {currentUserPerms?.['product.edit_details'] && (
                            <Link href={`/products/${product.id}`} className={styles.iconBtn}>
                              <Edit size={16} />
                            </Link>
                          )}
                          {currentUserPerms?.['product.delete'] && (
                            <button 
                              className={`${styles.iconBtn} ${styles.deleteBtn}`}
                              onClick={() => handleDelete(product.id, product.title)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
