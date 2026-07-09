'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import styles from './Roles.module.css';
import { defaultAdminPermissions, defaultStaffPermissions, PermissionsMap } from '@/types/staff';
import { useStaffStore } from '@/store/staffStore';

type RoleDef = {
  id: string;
  name: string;
  users: number;
  description: string;
  permissions: PermissionsMap;
};

// Hardcoded for UI demonstration based on actual system defaults
const INITIAL_ROLES: RoleDef[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    users: 0,
    description: 'Full access to all features and settings.',
    permissions: defaultAdminPermissions // Super Admin has all
  },
  {
    id: 'admin',
    name: 'Admin',
    users: 0,
    description: 'Manage almost everything except role & permission.',
    permissions: defaultAdminPermissions
  },
  {
    id: 'staff',
    name: 'Staff',
    users: 0,
    description: 'Can manage orders, products and customers.',
    permissions: defaultStaffPermissions
  }
];

const PERMISSION_GROUPS = [
  {
    title: 'Catalog',
    keys: [
      { key: 'product.view', label: 'View Products' },
      { key: 'product.edit_details', label: 'Edit Details' },
      { key: 'product.edit_price', label: 'Edit Price' },
      { key: 'product.edit_stock', label: 'Edit Stock' },
      { key: 'product.delete', label: 'Delete Products' },
    ]
  },
  {
    title: 'Sales & Orders',
    keys: [
      { key: 'order.view', label: 'View Orders' },
      { key: 'order.view_financials', label: 'View Financials' },
      { key: 'order.update_status', label: 'Update Status' },
      { key: 'order.cancel', label: 'Cancel Orders' },
    ]
  },
  {
    title: 'Customers & Wholesale',
    keys: [
      { key: 'customer.view', label: 'View Customers' },
      { key: 'wholesale.view', label: 'View Wholesale' },
      { key: 'wholesale.manage_pricing', label: 'Manage Wholesale Pricing' },
    ]
  },
  {
    title: 'Reports & Media',
    keys: [
      { key: 'reports.view_sales', label: 'View Sales Reports' },
      { key: 'reports.view_marketing', label: 'View Marketing' },
      { key: 'media.upload', label: 'Upload Media' },
    ]
  },
  {
    title: 'Settings & Admin',
    keys: [
      { key: 'staff.manage', label: 'Manage Staff' },
      { key: 'settings.manage', label: 'Manage Settings' },
      { key: 'audit_log.view', label: 'View Audit Logs' },
    ]
  }
];

export default function RolesPage() {
  const [activeRoleId, setActiveRoleId] = useState<string>('super_admin');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Create Role Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { staffList, customRoles, subscribeToStaff, fetchRoles, bulkUpdateRolePermissions, addCustomRole } = useStaffStore();

  useEffect(() => {
    const unsubStaff = subscribeToStaff();
    fetchRoles();
    return () => {
      unsubStaff();
    };
  }, [subscribeToStaff, fetchRoles]);

  // Combine initial hardcoded roles with custom roles from DB
  const ALL_ROLES = [...INITIAL_ROLES, ...customRoles];

  // Dynamically calculate users per role
  const dynamicRoles = ALL_ROLES.map(role => ({
    ...role,
    users: staffList.filter(s => s.role === role.id).length
  }));
  
  // We keep a local state of permissions to allow editing in the UI
  const [permissionsState, setPermissionsState] = useState<Record<string, PermissionsMap>>({});

  // Sync state when dynamic roles change (like when a new role is added)
  useEffect(() => {
    setPermissionsState(prev => {
      const newState = { ...prev };
      dynamicRoles.forEach(role => {
        if (!newState[role.id]) {
          newState[role.id] = { ...role.permissions };
        }
      });
      return newState;
    });
  }, [dynamicRoles.length]); // Only re-run when amount of roles changes

  const activeRole = dynamicRoles.find(r => r.id === activeRoleId);
  const activePermissions = permissionsState[activeRoleId] || activeRole?.permissions || defaultStaffPermissions;

  const handleToggle = (key: string) => {
    if (activeRoleId === 'super_admin') return; // Cannot edit super admin
    setPermissionsState(prev => ({
      ...prev,
      [activeRoleId]: {
        ...prev[activeRoleId],
        [key]: !prev[activeRoleId][key as keyof PermissionsMap]
      }
    }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeRoleId === 'super_admin') return;
    const isChecked = e.target.checked;
    const updated = { ...activePermissions };
    Object.keys(updated).forEach(k => {
      updated[k as keyof PermissionsMap] = isChecked;
    });
    setPermissionsState(prev => ({
      ...prev,
      [activeRoleId]: updated
    }));
  };

  const isAllSelected = Object.values(activePermissions).every(v => v === true);

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <div className={styles.rolesSidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Roles</h2>
          <p>Manage user roles and their permissions.</p>
        </div>

        <div className={styles.rolesList}>
          {dynamicRoles.map(role => (
            <div 
              key={role.id} 
              className={`${styles.roleCard} ${activeRoleId === role.id ? styles.active : ''}`}
              onClick={() => setActiveRoleId(role.id)}
            >
              <div className={styles.roleHeader}>
                <span className={styles.roleTitle}>{role.name}</span>
                <span className={styles.userCount}>{role.users} Users</span>
              </div>
              <p className={styles.roleDesc}>{role.description}</p>
            </div>
          ))}

          <button 
            className={styles.addRoleBtn} 
            onClick={() => setShowCreateModal(true)}
          >
            + Add New Role
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className={styles.permissionsPanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Permissions for {activeRole?.name}</h2>
            <p className={styles.panelSubtitle}>{activeRole?.description}</p>
          </div>
          
          <label className={styles.selectAllWrap}>
            <input 
              type="checkbox" 
              checked={isAllSelected}
              onChange={handleSelectAll}
              disabled={activeRoleId === 'super_admin'}
            />
            Select All
          </label>
        </div>

        <div className={styles.permissionsGrid}>
          {PERMISSION_GROUPS.map(group => (
            <div key={group.title} className={styles.permGroup}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <div className={styles.checkboxGrid}>
                {group.keys.map(perm => (
                  <label key={perm.key} className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={activePermissions[perm.key as keyof PermissionsMap] || false}
                      onChange={() => handleToggle(perm.key)}
                      disabled={activeRoleId === 'super_admin'}
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.panelFooter}>

          <button 
            className="btn btn-primary" 
            disabled={activeRoleId === 'super_admin' || isSaving}
            onClick={async () => {
              if (activeRoleId === 'super_admin') return;
              setIsSaving(true);
              setSaveSuccess(false);
              try {
                await bulkUpdateRolePermissions(activeRoleId, activePermissions);
                setSaveSuccess(true);
              } catch (error) {
                console.error(error);
                toast.error("Failed to save permissions.");
              } finally {
                setIsSaving(false);
              }
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.modalTitle}>Permissions Saved</h3>
            <p className={styles.modalDesc}>
              The permissions for <strong>{activeRole?.name}</strong> have been successfully updated across all users in this role.
            </p>
            <button className="btn btn-primary" onClick={() => setSaveSuccess(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ alignItems: 'flex-start' }}>
            <h3 className={styles.modalTitle}>Create New Role</h3>
            <p className={styles.modalDesc} style={{ textAlign: 'left' }}>
              Define a new custom role and inherit permissions from a base role.
            </p>

            <div className={styles.formGroup}>
              <label>Role Name</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="e.g. Sales Staff"
                value={newRoleName}
                onChange={e => setNewRoleName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Brief description of this role"
                value={newRoleDesc}
                onChange={e => setNewRoleDesc(e.target.value)}
              />
            </div>

            <div className={styles.modalFooterBtns}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCreateModal(false)}
                disabled={isCreating}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                disabled={!newRoleName || isCreating}
                onClick={async () => {
                  setIsCreating(true);
                  try {
                    await addCustomRole(newRoleName, newRoleDesc);
                    setShowCreateModal(false);
                    setNewRoleName('');
                    setNewRoleDesc('');
                  } catch (error) {
                    toast.error("Failed to create role");
                  } finally {
                    setIsCreating(false);
                  }
                }}
              >
                {isCreating ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
