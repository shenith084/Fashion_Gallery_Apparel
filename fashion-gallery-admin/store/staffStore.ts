import { create } from 'zustand';
import { collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { StaffMember, PermissionsMap } from '@/types/staff';

interface StaffState {
  staffList: StaffMember[];
  loading: boolean;
  error: string | null;
  subscribeToStaff: () => () => void; // Returns unsubscribe function
  addStaffRecord: (staff: StaffMember) => Promise<void>;
  updatePermissions: (staffId: string, permissions: PermissionsMap) => Promise<void>;
  toggleStaffStatus: (staffId: string, isActive: boolean) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staffList: [],
  loading: true,
  error: null,

  subscribeToStaff: () => {
    set({ loading: true, error: null });
    const staffRef = collection(db, 'staff');
    
    const unsubscribe = onSnapshot(
      staffRef,
      (snapshot) => {
        const staff = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as StaffMember[];
        
        set({ staffList: staff, loading: false });
      },
      (error) => {
        console.error("Error fetching staff:", error);
        set({ error: error.message, loading: false });
      }
    );

    return unsubscribe;
  },

  addStaffRecord: async (staff: StaffMember) => {
    try {
      const staffRef = doc(db, 'staff', staff.id);
      await setDoc(staffRef, staff);
    } catch (error: any) {
      console.error("Error adding staff record:", error);
      throw error;
    }
  },

  updatePermissions: async (staffId: string, permissions: PermissionsMap) => {
    try {
      const staffRef = doc(db, 'staff', staffId);
      await updateDoc(staffRef, { permissions });
    } catch (error: any) {
      console.error("Error updating permissions:", error);
      throw error;
    }
  },

  toggleStaffStatus: async (staffId: string, isActive: boolean) => {
    try {
      const staffRef = doc(db, 'staff', staffId);
      await updateDoc(staffRef, { isActive });
    } catch (error: any) {
      console.error("Error toggling staff status:", error);
      throw error;
    }
  }
}));
