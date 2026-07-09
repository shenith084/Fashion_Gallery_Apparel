'use client';

import { useState, useEffect } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { StaffMember, Role } from '@/types/staff';
import styles from './Modal.module.css';
import { toast } from 'react-hot-toast';

export default function PermissionsModal({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  const [role, setRole] = useState<Role | 'super_admin'>(staff.role as Role | 'super_admin');
  const [name, setName] = useState(staff.name || '');
  const [phone, setPhone] = useState(staff.phone || '');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { updateStaffDetails, deleteStaff, customRoles, fetchRoles } = useStaffStore();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (role !== staff.role || name !== staff.name || phone !== staff.phone) {
        await updateStaffDetails(staff.id, { role, name, phone });
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteStaff(staff.id);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to delete staff member');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth: '500px' }}>
        <div className={styles.header}>
          <div>
            <h2>Manage Staff Member</h2>
            <p className={styles.subtitle}>Editing: {staff.name}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {showDeleteConfirm ? (
          <div className={styles.content}>
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                backgroundColor: '#fef2f2', 
                color: '#ef4444', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                fontSize: '32px'
              }}>
                !
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Delete {staff.name}?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                This action is permanent and cannot be undone. All access for this user will be revoked immediately.
              </p>
            </div>
            <div className={styles.footer} style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                Cancel
              </button>
              <button 
                className="btn" 
                style={{ backgroundColor: '#ef4444', color: 'white' }} 
                onClick={handleDelete} 
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete Staff'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
          {staff.role === 'super_admin' && (
            <div className={styles.infoText} style={{ marginBottom: 'var(--space-4)', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
              Note: This user is a Super Admin. They have God Mode and cannot be deleted or demoted by regular Admins.
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Nimali Perera"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="e.g. 077 123 4567"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Staff Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="staff">Staff (Limited Permissions)</option>
              <option value="admin">Admin (Full Access)</option>
              <option value="super_admin">Super Admin (God Mode)</option>
              {customRoles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.footer} style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between' }}>
            {staff.role !== 'super_admin' ? (
              <button 
                className="btn" 
                style={{ backgroundColor: '#ef4444', color: 'white' }} 
                onClick={() => setShowDeleteConfirm(true)} 
                disabled={loading}
              >
                Delete Staff
              </button>
            ) : (
              <div /> // Spacer
            )}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading || (role === staff.role && name === staff.name && phone === staff.phone) || !name.trim()}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
