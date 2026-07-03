'use client';

import { useState } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { Role, defaultStaffPermissions, defaultAdminPermissions } from '@/types/staff';
import styles from './Modal.module.css';

export default function AddStaffModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addStaffRecord } = useStaffStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // NOTE: Normally we would call a Next.js Server Action here to use Firebase Admin SDK 
      // to create the Auth user. For now, we simulate a UID and write to Firestore.
      const simulatedUid = `temp_uid_${Date.now()}`;
      
      await addStaffRecord({
        id: simulatedUid,
        name,
        email,
        role,
        isActive: true,
        permissions: role === 'admin' ? defaultAdminPermissions : defaultStaffPermissions,
        createdAt: Date.now()
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Failed to add staff member. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Staff Member</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          
          <p className={styles.infoText}>
            Note: Creating actual login credentials requires the Firebase Admin SDK. 
            This form currently simulates creation for the Database/Permissions UI.
          </p>

          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@fashiongallery.lk"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Temporary Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Base Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="staff">Staff (Limited Permissions)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
