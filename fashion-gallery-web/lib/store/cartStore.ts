import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/data/products';

export interface CartItem {
  id: string; // Unique ID for the cart row (e.g., product_id + size + color)
  product: Product;
  size: string;
  color: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, qty: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, qty) => {
        const id = `${product.id}-${size}-${color}`;
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);
          if (existingItem) {
            // Update quantity if identical product, size, and color exists
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, qty: item.qty + qty } : item
              ),
            };
          }
          // Otherwise add new item
          return { items: [...state.items, { id, product, size, color, qty }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQty: (id, qty) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, qty } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.qty, 0);
      },
    }),
    {
      name: 'fashion-gallery-cart', // localStorage key
    }
  )
);
