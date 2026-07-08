'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import styles from './AccountTabs.module.css';

export default function Addresses() {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const addresses = user?.addresses || [];
  
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: '', street: '', city: '', province: '', phone: '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const updatedAddresses = [...addresses, { id: 'addr_' + Date.now(), isDefault: addresses.length === 0, ...newAddr }];
      await updateDoc(doc(db, 'users', user.uid), { addresses: updatedAddresses });
      updateUser({ addresses: updatedAddresses });
      setIsAdding(false);
      setNewAddr({ name: '', street: '', city: '', province: '', phone: '' });
    } catch (error) {
      console.error('Failed to save address', error);
    }
  };

  const removeAddress = async (id: string) => {
    if (!user) return;
    try {
      const updatedAddresses = addresses.filter(a => a.id !== id);
      await updateDoc(doc(db, 'users', user.uid), { addresses: updatedAddresses });
      updateUser({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Failed to remove address', error);
    }
  };

  return (
    <div className={styles.tabContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-soft-beige)' }}>
        <h2 className={styles.title} style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>Saved Addresses</h2>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Add New Address</button>}
      </div>
      
      <p className={styles.subtitle}>Manage your shipping and billing addresses for faster checkout.</p>

      {isAdding && (
        <form onSubmit={handleSave} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
          <h4 style={{ marginBottom: '1rem' }}>Add New Address</h4>
          <div className={styles.formRow}>
            <div className={styles.formGroup}><label>Full Name</label><input required value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} /></div>
            <div className={styles.formGroup}><label>Phone</label><input required value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} /></div>
          </div>
          <div className={styles.formGroup}><label>Street Address</label><input required value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} /></div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}><label>City</label><input required value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} /></div>
            <div className={styles.formGroup}><label>Province</label><input required value={newAddr.province} onChange={e => setNewAddr({...newAddr, province: e.target.value})} /></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsAdding(false)} className={styles.actionBtn}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Address</button>
          </div>
        </form>
      )}

      {addresses.length > 0 ? (
        <div className={styles.cardGrid}>
          {addresses.map((addr: any) => (
            <div key={addr.id} className={styles.itemCard}>
              {addr.isDefault && <span className={styles.badge}>Default</span>}
              <h4 className={styles.itemTitle}>{addr.name}</h4>
              <div className={styles.itemText}>
                {addr.street}<br/>
                {addr.city}, {addr.province}<br/>
                {addr.phone}
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => removeAddress(addr.id)} className={styles.actionBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className={styles.emptyState}>
            <p>You haven't saved any addresses yet.</p>
            <button onClick={() => setIsAdding(true)} className="btn btn-primary">Add Address</button>
          </div>
        )
      )}
    </div>
  );
}
