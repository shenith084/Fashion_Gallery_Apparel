'use client';

import { use, useEffect, useState } from 'react';
import ProductForm from '@/components/products/ProductForm';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/types/product';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a Promise, so we must unwrap it using React's `use` hook.
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const { getProductById, subscribeToProducts, loading } = useProductStore();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);

  // We need to ensure the store is loaded in case they navigate here directly
  useEffect(() => {
    const unsubscribe = subscribeToProducts();
    return () => unsubscribe();
  }, [subscribeToProducts]);

  useEffect(() => {
    if (!loading) {
      const p = getProductById(id);
      setProduct(p);
      setIsInitializing(false);
    }
  }, [loading, id, getProductById]);

  if (loading || isInitializing) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading product data...</div>;
  }

  if (!product) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found.</div>;
  }

  return <ProductForm initialData={product} />;
}
