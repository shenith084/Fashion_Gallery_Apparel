import { create } from 'zustand';
import { db, auth } from '@/lib/firebase/config';

export type WholesaleApplication = {
  id: string;
  fullName: string;
  businessName: string;
  businessType: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  orderValue: string;
  products: string;
  additionalInfo: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
};

interface WholesaleStore {
  applications: WholesaleApplication[];
  loading: boolean;
  subscribeToApplications: () => void; // Keeps same name for compatibility, but now fetches once
  updateStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => Promise<void>;
}

export const useWholesaleStore = create<WholesaleStore>((set) => ({
  applications: [],
  loading: true,

  subscribeToApplications: async () => {
    try {
      if (!auth.currentUser) return;
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/wholesale', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        set({ applications: data.apps, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching wholesale applications:", error);
      set({ loading: false });
    }
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      if (!auth.currentUser) return;
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`/api/wholesale/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      // Update local state
      set(state => ({
        applications: state.applications.map(app => 
          app.id === id ? { ...app, status } : app
        )
      }));
    } catch (error) {
      console.error(`Error updating wholesale application status:`, error);
      throw error;
    }
  }
}));
