import { create } from 'zustand';
import { collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { StaffMember, PermissionsMap, RoleDef, defaultAdminPermissions, defaultStaffPermissions } from '@/types/staff';

interface StaffState {
  staffList: StaffMember[];
  customRoles: RoleDef[];
  loading: boolean;
  error: string | null;
  subscribeToStaff: () => () => void;
  fetchRoles: () => Promise<void>;
  addStaffRecord: (staff: StaffMember) => Promise<void>;
  updatePermissions: (staffId: string, permissions: PermissionsMap) => Promise<void>;
  updateStaffDetails: (staffId: string, details: { role: string, name: string, phone: string }) => Promise<void>;
  toggleStaffStatus: (staffId: string, isActive: boolean) => Promise<void>;
  deleteStaff: (staffId: string) => Promise<void>;
  bulkUpdateRolePermissions: (roleId: string, permissions: PermissionsMap) => Promise<void>;
  addCustomRole: (name: string, description: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staffList: [],
  customRoles: [],
  loading: true,
  error: null,

  fetchRoles: async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        set({ customRoles: data.roles });
      }
    } catch (error) {
      console.error("Error fetching custom roles via API:", error);
    }
  },

  subscribeToStaff: () => {
    set({ loading: true, error: null });
    const staffRef = collection(db, 'staff');
    
    const unsubscribe = onSnapshot(
      staffRef,
      (snapshot) => {
        let staff = snapshot.docs.map(doc => ({
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

  bulkUpdateRolePermissions: async (roleId: string, permissions: PermissionsMap) => {
    try {
      const { staffList, customRoles } = get();
      
      // If it's a custom role, update the role document itself via API
      const isCustomRole = customRoles.some(r => r.id === roleId);
      if (isCustomRole) {
        const response = await fetch('/api/roles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: roleId, permissions })
        });
        if (!response.ok) {
          throw new Error('Failed to update base role permissions');
        }
      }

      const usersToUpdate = staffList.filter(user => user.role === roleId);
      
      const promises = usersToUpdate.map(user => {
        const staffRef = doc(db, 'staff', user.id);
        return updateDoc(staffRef, { permissions });
      });
      
      await Promise.all(promises);
      if (isCustomRole) {
        get().fetchRoles(); // Refresh to get the updated role permissions
      }
    } catch (error: any) {
      console.error("Error bulk updating role permissions:", error);
      throw error;
    }
  },

  addCustomRole: async (name: string, description: string) => {
    try {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const emptyPermissions = Object.keys(defaultStaffPermissions).reduce((acc, key) => {
        acc[key as keyof PermissionsMap] = false;
        return acc;
      }, {} as PermissionsMap);

      const newRole: Omit<RoleDef, 'users'> = {
        id,
        name,
        description,
        permissions: emptyPermissions,
        isCustom: true
      };

      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create role');
      }
      
      // Refresh the roles list in state
      get().fetchRoles();
    } catch (error: any) {
      console.error("Error creating custom role:", error);
      throw error;
    }
  },


  updateStaffDetails: async (staffId: string, details: { role: string, name: string, phone: string }) => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      if (!auth.currentUser) throw new Error("Not authenticated");
      const token = await auth.currentUser.getIdToken();

      const res = await fetch(`/api/staff/${staffId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(details)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update details');
    } catch (error: any) {
      console.error("Error updating details:", error);
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
  },

  deleteStaff: async (staffId: string) => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      if (!auth.currentUser) throw new Error("Not authenticated");
      const token = await auth.currentUser.getIdToken();

      const res = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete staff member');

      // The snapshot listener will automatically update the list
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  }
}));
