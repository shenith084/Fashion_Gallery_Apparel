'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

type PaymentSettings = {
  cashOnDelivery: boolean;
  bankTransfer: boolean;
  bankAccounts: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch: string;
  }[];
};

const DEFAULT_PAYMENT: PaymentSettings = {
  cashOnDelivery: true,
  bankTransfer: true,
  bankAccounts: []
};

export default function PaymentSettingsManager() {
  const [formData, setFormData] = useState<PaymentSettings>(DEFAULT_PAYMENT);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
        fetchPaymentSettings(token);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPaymentSettings = async (token: string) => {
    try {
      const res = await fetch('/api/settings?docId=payment', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setFormData({ ...DEFAULT_PAYMENT, ...data.data });
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleBankChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newBanks = [...prev.bankAccounts];
      newBanks[index] = { ...newBanks[index], [field]: value };
      return { ...prev, bankAccounts: newBanks };
    });
  };

  const addBankAccount = () => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, { accountName: '', accountNumber: '', bankName: '', branch: '' }]
    }));
  };

  const removeBankAccount = (index: number) => {
    setFormData(prev => {
      const newBanks = [...prev.bankAccounts];
      newBanks.splice(index, 1);
      return { ...prev, bankAccounts: newBanks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          docId: 'payment',
          ...formData
        })
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save error', error);
      toast.error('Failed to save payment settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
      <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
      <p className="text-gray-500 mb-6">Manage how customers can pay for their orders.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Payment Methods */}
        <div>
          <h3 className="font-semibold mb-3">Accepted Payment Methods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                name="cashOnDelivery"
                checked={formData.cashOnDelivery}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              Cash on Delivery (COD)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                name="bankTransfer"
                checked={formData.bankTransfer}
                onChange={handleChange}
                style={{ width: '18px', height: '18px' }}
              />
              Bank Transfer / Direct Deposit
            </label>
          </div>
        </div>

        <hr style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />

        {/* Bank Accounts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="font-semibold">Bank Accounts</h3>
            <button 
              type="button" 
              onClick={addBankAccount}
              style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              + Add Bank Account
            </button>
          </div>

          {formData.bankAccounts.length === 0 && (
            <p className="text-gray-500 text-sm italic">No bank accounts added yet.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {formData.bankAccounts.map((bank, index) => (
              <div key={index} style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '8px', position: 'relative', background: '#fafafa' }}>
                <button 
                  type="button" 
                  onClick={() => removeBankAccount(index)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Remove
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Bank Name</label>
                    <input type="text" value={bank.bankName} onChange={e => handleBankChange(index, 'bankName', e.target.value)} required style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px' }} placeholder="e.g. Commercial Bank" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Branch</label>
                    <input type="text" value={bank.branch} onChange={e => handleBankChange(index, 'branch', e.target.value)} required style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px' }} placeholder="e.g. Colombo 03" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Account Name</label>
                    <input type="text" value={bank.accountName} onChange={e => handleBankChange(index, 'accountName', e.target.value)} required style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px' }} placeholder="e.g. My Moon Clothing" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Account Number</label>
                    <input type="text" value={bank.accountNumber} onChange={e => handleBankChange(index, 'accountNumber', e.target.value)} required style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px' }} placeholder="e.g. 10002938475" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={isSaving}
            style={{ 
              padding: '0.75rem 2rem', 
              background: 'var(--color-burgundy)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 500,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Payment Settings'}
          </button>
          {saveSuccess && (
            <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>✓ Saved Successfully</span>
          )}
        </div>
      </form>
    </div>
  );
}
