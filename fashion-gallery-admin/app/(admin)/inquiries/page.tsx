'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Search, Eye, Trash2, Mail, Phone, Calendar, X, AlertTriangle } from 'lucide-react';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
    
    // Set up 10-second polling for real-time updates
    const intervalId = setInterval(() => {
      fetchInquiries();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchInquiries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'inquiries'));
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      
      setInquiries(data);
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (inquiry: any) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === 'Unread') {
      try {
        await updateDoc(doc(db, 'inquiries', inquiry.id), { status: 'Read' });
        setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, status: 'Read' } : i));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(i => i.id !== id));
      setDeleteConfirmId(null);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch (err) {
      console.error('Failed to delete inquiry', err);
      toast.error('Failed to delete message.');
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return i.name.toLowerCase().includes(search) || 
           i.email.toLowerCase().includes(search) || 
           i.message.toLowerCase().includes(search);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="section-title">Messages & Inquiries</h1>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-charcoal-light)' }} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-sand)', color: 'var(--color-charcoal)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading messages...</td></tr>
            ) : filteredInquiries.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-charcoal-light)' }}>No messages found.</td></tr>
            ) : (
              filteredInquiries.map((inq) => {
                const dateStr = inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : new Date(inq.createdAt).toLocaleDateString();
                const isUnread = inq.status === 'Unread';
                return (
                  <tr key={inq.id} style={{ borderBottom: '1px solid var(--color-gray-100)', background: isUnread ? 'rgba(235, 87, 87, 0.05)' : 'white' }}>
                    <td style={{ padding: '1rem', color: 'var(--color-charcoal-light)' }}>{dateStr}</td>
                    <td style={{ padding: '1rem', fontWeight: isUnread ? 600 : 400 }}>{inq.name}</td>
                    <td style={{ padding: '1rem' }}>{inq.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: isUnread ? '#FFEAEA' : '#E8F5E9',
                        color: isUnread ? '#EB5757' : '#2E7D32'
                      }}>
                        {inq.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleView(inq)} style={{ padding: '6px', background: 'var(--color-sand)', borderRadius: '6px', color: 'var(--color-charcoal)' }}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(inq.id)} style={{ padding: '6px', background: '#FFEAEA', borderRadius: '6px', color: '#EB5757' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedInquiry && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Message Details</h2>
              <button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-charcoal-light)' }}><X size={24} /></button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-sand)', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12}/> Email</p>
                  <p style={{ fontWeight: 500 }}>{selectedInquiry.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={12}/> Phone</p>
                  <p style={{ fontWeight: 500 }}>{selectedInquiry.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12}/> Received On</p>
                  <p style={{ fontWeight: 500 }}>{selectedInquiry.createdAt?.toDate ? selectedInquiry.createdAt.toDate().toLocaleString() : new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal-light)', marginBottom: '0.75rem' }}>Message from {selectedInquiry.name}</h3>
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {selectedInquiry.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '1.5rem', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#EB5757" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Message?</h3>
            <p style={{ color: 'var(--color-charcoal-light)', marginBottom: '1.5rem' }}>Are you sure you want to delete this message? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, padding: '0.75rem', background: 'var(--color-gray-200)', borderRadius: '6px', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} style={{ flex: 1, padding: '0.75rem', background: '#EB5757', color: 'white', borderRadius: '6px', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
