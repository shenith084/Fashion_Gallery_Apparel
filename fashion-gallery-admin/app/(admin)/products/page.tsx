'use client';

import { useEffect, useState, useRef } from 'react';
import { Eye, Edit2, MoreVertical, Plus, Search, X, Trash2, Upload, ImagePlus } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from './Products.module.css';

const CATEGORIES = ['All Categories', 'New Arrivals', 'Dresses', 'Office Wear', 'Tops', 'Bottoms'];
const STATUSES = ['All Status', 'Active', 'Low Stock', 'Out of Stock'];
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

interface Product {
  id: string; name: string; slug: string; sku: string; price: number;
  image: string; images: string[]; category: string; categorySlug: string;
  stock: number; status: string; sizes: string[]; colors: string[];
  rating: number; reviewCount: number; fabric: string; description: string; modelSize: string;
}

const emptyProduct: Partial<Product> = {
  name: '', slug: '', sku: '', price: 0, image: '', images: [],
  category: 'Dresses', categorySlug: 'dresses', stock: 0, status: 'Active',
  sizes: ['M', 'L', 'XL'], colors: [], fabric: '', description: '', modelSize: 'Uk 10 (M)',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All Categories' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'All Status' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return styles.badgeActive;
      case 'Low Stock': return styles.badgeLowStock;
      case 'Out of Stock': return styles.badgeOutOfStock;
      default: return styles.badgeDraft;
    }
  };

  const openAddModal = () => { setEditProduct({ ...emptyProduct }); setIsEditing(false); };
  const openEditModal = (product: Product) => { setEditProduct({ ...product }); setIsEditing(true); setOpenMenuId(null); };
  const closeModal = () => setEditProduct(null);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const currentImages = editProduct?.images || [];
    const remaining = 3 - currentImages.length;
    if (remaining <= 0) { showNotification('Maximum 3 images allowed.', 'error'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).slice(0, remaining).forEach(f => formData.append('files', f));
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.urls) {
        const newImages = [...currentImages, ...data.urls].slice(0, 3);
        setEditProduct(p => ({ ...p, image: newImages[0], images: newImages }));
        showNotification('Images uploaded!');
      } else showNotification('Upload failed.', 'error');
    } catch { showNotification('Upload error.', 'error'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx: number) => {
    const imgs = [...(editProduct?.images || [])].filter((_, i) => i !== idx);
    setEditProduct(p => ({ ...p, image: imgs[0] || '', images: imgs }));
  };

  const handleStockStatusSync = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 15) return 'Low Stock';
    return 'Active';
  };

  const handleSave = async () => {
    if (!editProduct) return;
    setSaving(true);
    try {
      const payload = { ...editProduct, slug: editProduct.name?.toLowerCase().replace(/\s+/g, '-') || '' };
      if (isEditing && payload.id) {
        const docRef = doc(db, 'products', payload.id);
        delete payload.id;
        await updateDoc(docRef, payload);
        showNotification('Product updated!');
      } else {
        await addDoc(collection(db, 'products'), payload);
        showNotification('Product created!');
      }
      await fetchProducts(); 
      closeModal();
    } catch (error) { 
      console.error(error);
      showNotification('Failed to save product.', 'error'); 
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      await fetchProducts(); 
      setDeleteConfirmId(null); 
      setOpenMenuId(null); 
      showNotification('Product deleted.');
    } catch (error) { 
      console.error(error);
      showNotification('Failed to delete.', 'error'); 
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <div className={`${styles.notification} ${notification.type === 'error' ? styles.notifError : styles.notifSuccess}`}>
          {notification.msg}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.breadcrumb}>Dashboard &rsaquo; Products</p>
        </div>
        <button className={styles.addBtn} onClick={openAddModal}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: 'Total Products', value: totalProducts, change: '↑ 8.6%', color: '#6b2335', bg: 'rgba(107,35,53,0.08)' },
          { label: 'Active Products', value: activeProducts, change: '↑ 12.4%', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Out of Stock', value: outOfStock, change: '↓ 12.5%', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Low Stock', value: lowStock, change: '↓ 5.1%', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
        ].map(stat => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.bg }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statChange} style={{ color: stat.change.startsWith('↑') ? '#22c55e' : '#ef4444' }}>
                {stat.change} vs last 30 days
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search by product name, SKU or code..." value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className={styles.searchInput} />
        </div>
        <select className={styles.filterSelect} value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className={styles.filterSelect} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b2335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <span style={{ opacity: 0.8 }}>Loading products...</span>
          </div>
        ) :
          paginated.length === 0 ? <div className={styles.emptyState}>No products found.</div> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>PRODUCT</th><th>SKU</th><th>CATEGORY</th>
                  <th>PRICE (LKR)</th><th>STOCK</th><th>STATUS</th><th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(product => (
                  <tr key={product.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumbnail}>
                          {product.image ? <img src={product.image} alt={product.name} /> : <div className={styles.thumbPlaceholder}><Upload size={14} color="#bbb" /></div>}
                        </div>
                        <div className={styles.productInfo}>
                          <span className={styles.productName}>{product.name}</span>
                          <span className={styles.productMeta}>Size: {product.sizes?.slice(0,3).join(', ')} | Color: {product.colors?.slice(0,2).join(', ')}</span>
                          <span className={styles.productMeta} style={{fontStyle:'italic'}}>{String(product.id).substring(0,6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.skuCell}>SKU: {product.sku}</td>
                    <td>{product.category}</td>
                    <td className={styles.priceCell}>LKR {product.price?.toLocaleString('en-LK')}</td>
                    <td><span className={product.stock === 0 ? styles.stockZero : product.stock < 15 ? styles.stockLow : ''}>{product.stock}</span></td>
                    <td><span className={`${styles.badge} ${getStatusClass(product.status)}`}>{product.status}</span></td>
                    <td>
                      <div className={styles.actionButtons} ref={menuRef}>
                        <button className={styles.actionBtn} title="Edit" onClick={() => openEditModal(product)}><Edit2 size={16} /></button>
                        <button className={styles.actionBtn} title="Delete" onClick={() => setDeleteConfirmId(product.id)}><Trash2 size={16} color="#ef4444" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Showing {(currentPage-1)*itemsPerPage+1} to {Math.min(currentPage*itemsPerPage,filtered.length)} of {filtered.length} products</span>
            <div className={styles.pageButtons}>
              <button disabled={currentPage<=1} onClick={()=>setCurrentPage(p=>p-1)} className={styles.pageBtn}>&lt;</button>
              {Array.from({length:Math.min(7,totalPages)},(_,i)=>i+1).map(pg=>(
                <button key={pg} className={`${styles.pageBtn} ${pg===currentPage?styles.pageBtnActive:''}`} onClick={()=>setCurrentPage(pg)}>{pg}</button>
              ))}
              {totalPages>7&&<span>...</span>}
              <button disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(p=>p+1)} className={styles.pageBtn}>&gt;</button>
            </div>
            <select className={styles.filterSelect} value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}}>
              {ITEMS_PER_PAGE_OPTIONS.map(n=><option key={n}>{n} per page</option>)}
            </select>
          </div>
        )}
      </div>

      {editProduct !== null && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e=>e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className={styles.modalClose} onClick={closeModal}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label>Product Name</label><input type="text" value={editProduct.name||''} onChange={e=>setEditProduct(p=>({...p,name:e.target.value}))} placeholder="e.g. Floral Maxi Dress" /></div>
                <div className={styles.formGroup}><label>SKU</label><input type="text" value={editProduct.sku||''} onChange={e=>setEditProduct(p=>({...p,sku:e.target.value}))} placeholder="e.g. MM-DRESS-001" /></div>
                <div className={styles.formGroup}><label>Price (LKR)</label><input type="number" value={editProduct.price||0} onChange={e=>setEditProduct(p=>({...p,price:Number(e.target.value)}))} /></div>
                <div className={styles.formGroup}><label>Stock</label><input type="number" value={editProduct.stock??0} onChange={e=>{const stock=Number(e.target.value);setEditProduct(p=>({...p,stock,status:handleStockStatusSync(stock)}));}} /></div>
                <div className={styles.formGroup}><label>Category</label>
                  <select value={editProduct.category||'Dresses'} onChange={e=>setEditProduct(p=>({...p,category:e.target.value,categorySlug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))}>
                    {['New Arrivals','Maxi Dresses','Midi Dresses','Office Wear','Tops','Bottoms','Jumpsuits'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}><label>Status</label>
                  <select value={editProduct.status||'Active'} onChange={e=>setEditProduct(p=>({...p,status:e.target.value}))}>
                    <option>Active</option><option>Low Stock</option><option>Out of Stock</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{gridColumn:'1/-1'}}><label>Fabric</label><input type="text" value={editProduct.fabric||''} onChange={e=>setEditProduct(p=>({...p,fabric:e.target.value}))} /></div>
                <div className={styles.formGroup} style={{gridColumn:'1/-1'}}><label>Description</label><textarea rows={3} value={editProduct.description||''} onChange={e=>setEditProduct(p=>({...p,description:e.target.value}))} /></div>
                <div className={styles.formGroup}><label>Sizes (comma separated)</label><input type="text" value={(editProduct.sizes||[]).join(', ')} onChange={e=>setEditProduct(p=>({...p,sizes:e.target.value.split(',').map(s=>s.trim())}))} /></div>
                <div className={styles.formGroup}><label>Colors (comma separated)</label><input type="text" value={(editProduct.colors||[]).join(', ')} onChange={e=>setEditProduct(p=>({...p,colors:e.target.value.split(',').map(s=>s.trim())}))} /></div>
                {/* IMAGE UPLOAD SECTION */}
                <div className={styles.formGroup} style={{gridColumn:'1/-1'}}>
                  <label>Product Images <span style={{fontWeight:400, color:'#999', textTransform:'none'}}>(Max 7 images — first image is the main card image)</span></label>
                  <div className={styles.imageUploadGrid}>
                    {/* Existing images */}
                    {(editProduct.images||[]).map((img, idx) => (
                      <div key={idx} className={styles.imageUploadSlot} style={{position:'relative'}}>
                        <img src={img} alt={`Image ${idx+1}`} className={styles.uploadedImg} />
                        {idx === 0 && <span className={styles.mainBadge}>Main</span>}
                        <button className={styles.removeImgBtn} onClick={() => removeImage(idx)} type="button"><X size={12} /></button>
                      </div>
                    ))}
                    {/* Upload slot — show if less than 7 */}
                    {(editProduct.images||[]).length < 7 && (
                      <div
                        className={styles.imageUploadSlot}
                        onClick={() => fileInputRef.current?.click()}
                        style={{cursor:'pointer'}}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{display:'none'}}
                          onChange={e => handleImageUpload(e.target.files)}
                        />
                        {uploading ? (
                          <div className={styles.uploadPlaceholder}>
                            <div className={styles.uploadSpinner} />
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <div className={styles.uploadPlaceholder}>
                            <ImagePlus size={24} color="#bbb" />
                            <span>Upload Image</span>
                            <span style={{fontSize:'10px',color:'#ccc'}}>{7-(editProduct.images||[]).length} slot(s) left</span>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Empty placeholder slots */}
                    {Array.from({length: Math.max(0, 7 - Math.max((editProduct.images||[]).length, 1))}).map((_, i) => (
                      <div key={`empty-${i}`} className={`${styles.imageUploadSlot} ${styles.imageUploadEmpty}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>{saving?'Saving...':(isEditing?'Update Product':'Create Product')}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={()=>setDeleteConfirmId(null)}>
          <div className={styles.confirmModal} onClick={e=>e.stopPropagation()}>
            <div className={styles.confirmIcon}><Trash2 size={28} color="#ef4444" /></div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone. The product will be permanently removed.</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={()=>setDeleteConfirmId(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={()=>handleDelete(deleteConfirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
