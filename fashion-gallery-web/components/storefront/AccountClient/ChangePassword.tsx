'use client';

import React, { useState } from 'react';
import styles from './AccountTabs.module.css';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className={styles.tabContainer} style={{ maxWidth: '600px' }}>
      <h2 className={styles.title}>Change Password</h2>
      <p className={styles.subtitle}>Update your password to keep your account secure.</p>

      {success && (
        <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
          Password successfully updated!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input 
            type="password" 
            id="currentPassword" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter your current password"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input 
            type="password" 
            id="newPassword" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your new password"
          />
        </div>

        <div className={styles.submitRow}>
          <button type="submit" className="btn btn-primary">Update Password</button>
        </div>
      </form>
    </div>
  );
}
