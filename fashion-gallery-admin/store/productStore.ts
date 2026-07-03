import { create } from 'zustand';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Product } from '@/types/product';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  subscribeToProducts: () => () => void;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: true,
  error: null,

  subscribeToProducts: () => {
    set({ loading: true, error: null });
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Product[];
        
        set({ products: productList, loading: false });
      },
      (error) => {
        console.error("Error fetching products:", error);
        set({ error: error.message, loading: false });
      }
    );

    return unsubscribe;
  },

  saveProduct: async (product: Product) => {
    try {
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, product);
    } catch (error: any) {
      console.error("Error saving product:", error);
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error: any) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  getProductById: (id: string) => {
    return get().products.find(p => p.id === id);
  }
}));
