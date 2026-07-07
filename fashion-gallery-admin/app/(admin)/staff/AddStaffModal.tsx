'use client';

import { useState, useEffect } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { Role } from '@/types/staff';
import styles from './Modal.module.css';
import { auth } from '@/lib/firebase/config';

export default function AddStaffModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role | 'super_admin'>('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { customRoles, fetchRoles } = useStaffStore();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!auth.currentUser) throw new Error("Not authenticated");
      const token = await auth.currentUser.getIdToken();

      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, phone, role })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create staff member');
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add staff member.');
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
            <label>Phone Number (Optional)</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 071 234 5678"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Staff Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role | 'super_admin')}>
              <option value="staff">Staff (Limited Permissions)</option>
              <option value="admin">Admin (Full Access)</option>
              <option value="super_admin">Super Admin (God Mode)</option>
              {customRoles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
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
