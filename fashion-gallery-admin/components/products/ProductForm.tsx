'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { useStaffStore } from '@/store/staffStore';
import { auth } from '@/lib/firebase/config';
import { CldUploadWidget } from 'next-cloudinary';
import { Trash2, Plus, UploadCloud } from 'lucide-react';
import styles from './ProductForm.module.css';

// Fix import
import { Product as ProductType, ProductImage as ProductImageType, StockItem as StockItemType } from '@/types/product';

interface ProductFormProps {
  initialData?: ProductType;
}

const CATEGORIES = ['new-arrivals', 'best-sellers', 'maxi-dresses', 'midi-dresses', 'office-wear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { saveProduct } = useProductStore();
  const { staffList } = useStaffStore();
  
  // Find current user permissions
  const currentUser = staffList.find(s => s.id === auth.currentUser?.uid);
  const isSuperAdmin = currentUser?.role === 'admin';

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [costPrice, setCostPrice] = useState(initialData?.costPrice || 0);
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [images, setImages] = useState<ProductImageType[]>(initialData?.images || []);
  const [stock, setStock] = useState<StockItemType[]>(initialData?.stock || []);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      setImages(prev => [
        ...prev,
        { url: result.info.secure_url, public_id: result.info.public_id }
      ]);
    }
  };

  const removeImage = (publicId: string) => {
    setImages(prev => prev.filter(img => img.public_id !== publicId));
  };

  const handleStockChange = (size: string, color: string, qty: number) => {
    setStock(prev => {
      const existingIndex = prev.findIndex(item => item.size === size && item.color === color);
      if (existingIndex >= 0) {
        const newStock = [...prev];
        newStock[existingIndex].quantity = qty;
        return newStock;
      }
      return [...prev, { size, color, quantity: qty }];
    });
  };

  const getStockQty = (size: string, color: string) => {
    return stock.find(item => item.size === size && item.color === color)?.quantity || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productId = initialData?.id || `prod_${Date.now()}`;
      
      const productData: ProductType = {
        id: productId,
        title,
        description,
        category,
        price,
        costPrice: isSuperAdmin ? costPrice : (initialData?.costPrice || 0), // staff can't change cost price
        images,
        stock,
        status,
        createdAt: initialData?.createdAt || Date.now(),
        updatedAt: Date.now()
      };

      await saveProduct(productData);
      router.push('/products');
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // Temp simple single color for demo:
  const color = 'Default';

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h1>
        <div className={styles.headerActions}>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/products')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Basic Info */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h3>Basic Information</h3>
            
            <div className={styles.inputGroup}>
              <label>Product Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Pricing</h3>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Retail Price (Rs.)</label>
                <input type="number" required min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              
              {isSuperAdmin && (
                <div className={styles.inputGroup}>
                  <label>Cost Price (Private) (Rs.)</label>
                  <input type="number" required min="0" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h3>Inventory & Stock</h3>
            <p className={styles.subtext}>Enter the number of items available for each size.</p>
            
            <div className={styles.stockGrid}>
              {SIZES.map(size => (
                <div key={size} className={styles.stockItem}>
                  <label>{size}</label>
                  <input 
                    type="number" 
                    min="0"
                    value={getStockQty(size, color) || ''} 
                    onChange={(e) => handleStockChange(size, color, Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3>Product Images</h3>
            <p className={styles.subtext}>Upload up to 5 images. The first image will be the thumbnail.</p>

            <div className={styles.imageGrid}>
              {images.map((img, idx) => (
                <div key={img.public_id} className={styles.imageWrapper}>
                  <img src={img.url} alt="Product" />
                  <button type="button" className={styles.deleteImgBtn} onClick={() => removeImage(img.public_id)}>
                    <Trash2 size={14} />
                  </button>
                  {idx === 0 && <span className={styles.mainBadge}>Main</span>}
                </div>
              ))}
              
              <CldUploadWidget 
                uploadPreset="fashion_gallery" 
                options={{ maxFiles: 5 }}
                onSuccess={handleImageUpload}
              >
                {({ open }) => {
                  return (
                    <button type="button" className={styles.uploadBtn} onClick={() => open()}>
                      <UploadCloud size={24} />
                      <span>Upload</span>
                    </button>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
