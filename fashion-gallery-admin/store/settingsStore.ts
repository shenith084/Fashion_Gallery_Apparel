import { create } from 'zustand';
import { db, auth } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type ContactSettings = {
  address: string;
  phone: string;
  email: string;
  businessHoursMain: string;
  businessHoursWeekend: string;
};

const defaultContactSettings: ContactSettings = {
  address: '186 Main St, Colombo, Western 01100',
  phone: '076 416 5908',
  email: 'mymoonclothingsl@gmail.com',
  businessHoursMain: 'Mon – Sat: 9:00 AM – 7:00 PM',
  businessHoursWeekend: 'Sunday: 9:00 AM – 2:00 PM'
};

interface SettingsStore {
  contactSettings: ContactSettings;
  loading: boolean;
  fetchContactSettings: () => Promise<void>;
  updateContactSettings: (settings: ContactSettings) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  contactSettings: defaultContactSettings,
  loading: true,

  fetchContactSettings: async () => {
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const headers: Record<string, string> = {};
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
      
      const res = await fetch('/api/settings?docId=contact', { headers });
      const data = await res.json();
      
      if (res.ok && data.data) {
        set({ contactSettings: data.data as ContactSettings, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching contact settings:", error);
      set({ loading: false });
    }
  },

  updateContactSettings: async (settings: ContactSettings) => {
    try {
      if (!auth.currentUser) throw new Error('Not authenticated');
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to update settings');

      set({ contactSettings: settings });
    } catch (error) {
      console.error("Error updating contact settings:", error);
      throw error;
    }
  }
}));
