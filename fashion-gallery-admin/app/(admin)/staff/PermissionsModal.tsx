'use client';

import { useState } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { StaffMember, PermissionsMap } from '@/types/staff';
import styles from './Modal.module.css';

export default function PermissionsModal({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  const [permissions, setPermissions] = useState<PermissionsMap>({ ...staff.permissions });
  const [loading, setLoading] = useState(false);
  const { updatePermissions } = useStaffStore();

  const handleToggle = (key: keyof PermissionsMap) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePermissions(staff.id, permissions);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save permissions');
    } finally {
      setLoading(false);
    }
  };

  // Group permissions logically
  const groups = [
    {
      title: 'Products & Stock',
      keys: ['product.view', 'product.edit_stock', 'product.edit_details', 'product.edit_price', 'product.delete']
    },
    {
      title: 'Orders',
      keys: ['order.view', 'order.update_status', 'order.view_financials', 'order.cancel']
    },
    {
      title: 'Customers & Wholesale',
      keys: ['customer.view', 'wholesale.view', 'wholesale.manage_pricing']
    },
    {
      title: 'Admin & Settings',
      keys: ['media.upload', 'reports.view_sales', 'reports.view_marketing', 'staff.manage', 'settings.manage', 'audit_log.view']
    }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth: '600px' }}>
        <div className={styles.header}>
          <div>
            <h2>Manage Permissions</h2>
            <p className={styles.subtitle}>Editing: {staff.name} ({staff.role})</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {staff.role === 'admin' && (
            <div className={styles.infoText} style={{ marginBottom: 'var(--space-4)' }}>
              Note: This user is an Admin. They generally have access to all modules regardless of toggles.
            </div>
          )}

          <div className={styles.permissionsGrid}>
            {groups.map(group => (
              <div key={group.title} className={styles.permissionGroup}>
                <h3>{group.title}</h3>
                <div className={styles.toggles}>
                  {group.keys.map(key => {
                    const permKey = key as keyof PermissionsMap;
                    return (
                      <label key={permKey} className={styles.toggleLabel}>
                        <div className={styles.toggleText}>
                          <span>{permKey.replace('.', ' • ').replace('_', ' ')}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={permissions[permKey]}
                          onChange={() => handleToggle(permKey)}
                          className={styles.toggleInput}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer} style={{ marginTop: 'var(--space-6)' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
