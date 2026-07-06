import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
};

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
