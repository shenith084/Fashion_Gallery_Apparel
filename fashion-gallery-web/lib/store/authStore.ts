import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  wishlist?: string[];
  addresses?: any[];
  preferences?: any;
  createdAt?: string | number | Date;
};

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
