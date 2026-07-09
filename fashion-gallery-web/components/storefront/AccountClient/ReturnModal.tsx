'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './MyOrders.module.css'; // Reusing for simplicity, or create ReturnModal.module.css

export default function ReturnModal({ order, onClose, onSubmit }: { order: any, onClose: () => void, onSubmit: (data: any) => void }) {
  const [reason, setReason] = useState("Size doesn't fit");
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const returnData = {
        orderId: order.id,
        customer: order.customer,
        reason,
        note,
        items: order.items,
        total: order.total,
        avatar: order.avatar
      };
      
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
      });
      
      if (res.ok) {
        const data = await res.json();
        onSubmit(data.returnData);
      } else {
        toast.error('Failed to submit return');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Return Request - {order.id}</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Reason for Return</label>
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option>Size doesn't fit</option>
            <option>Product not as described</option>
            <option>Damaged item</option>
            <option>Changed my mind</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Customer Note</label>
          <textarea 
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Please provide any additional details..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 20px', border: 'none', background: '#6b2335', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            {submitting ? 'Submitting...' : 'Submit Return'}
          </button>
        </div>
      </div>
    </div>
  );
}
