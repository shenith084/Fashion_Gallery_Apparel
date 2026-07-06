'use client';

import React, { useState, useEffect } from 'react';
import styles from './returns.module.css';
import { Search, ChevronDown, Calendar, MoreVertical, X, Check, XCircle } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Returns');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'returns'));
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setReturns(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch returns', error);
        setLoading(false);
      }
    };
    
    fetchReturns();
    const interval = setInterval(fetchReturns, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  const TABS = [
    { name: 'All Returns', count: returns.length },
    { name: 'Requested', count: returns.filter(r => r.status === 'Requested').length },
    { name: 'Approved', count: returns.filter(r => r.status === 'Approved').length },
    { name: 'Rejected', count: returns.filter(r => r.status === 'Rejected').length },
    { name: 'Refunded', count: returns.filter(r => r.status === 'Refunded').length },
  ];

  const filteredReturns = returns.filter(r => {
    if (activeTab !== 'All Returns' && r.status !== activeTab) return false;
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!r.id.toLowerCase().includes(search) &&
          !r.orderId.toLowerCase().includes(search) &&
          !r.customer.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    if (dateFilter) {
      const returnDate = new Date(r.date);
      const filterDateObj = new Date(dateFilter);
      if (returnDate.toDateString() !== filterDateObj.toDateString()) return false;
    }
    
    return true;
  });

  const handleRowClick = async (id: string) => {
    setSelectedReturnId(id);
    const clickedReturn = returns.find(r => r.id === id);
    if (clickedReturn && clickedReturn.isNew) {
      setReturns(prev => prev.map(r => r.id === id ? { ...r, isNew: false } : r));
      await updateDoc(doc(db, 'returns', id), { isNew: false });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'returns', id), { status: newStatus });
      setReturns(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setSelectedReturnId(null);
    } catch (error) {
      console.error('Failed to update return', error);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Requested': return styles.statusRequested;
      case 'Approved': return styles.statusApproved;
      case 'Rejected': return styles.statusRejected;
      case 'Refunded': return styles.statusRefunded;
      default: return '';
    }
  };

  const selectedReturn = returns.find(r => r.id === selectedReturnId);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Returns</h1>
        <div className={styles.breadcrumbs}>
          <span>Dashboard</span> &gt; Returns
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {TABS.map(tab => (
          <div 
            key={tab.name} 
            className={`${styles.tab} ${activeTab === tab.name ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
            <span className={styles.tabBadge}>{tab.count}</span>
          </div>
        ))}
      </div>

      <div className={styles.filtersRow}>
        <select 
          className={styles.filterSelect} 
          style={{ appearance: 'none', cursor: 'pointer', outline: 'none' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Requested">Requested</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Refunded">Refunded</option>
        </select>

        <div className={styles.filterDate} style={{ position: 'relative' }}>
          <Calendar size={14} style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '24px', color: 'inherit', fontFamily: 'inherit', fontSize: '13px' }} 
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterSearch}>
          <Search size={14} style={{ color: 'var(--color-charcoal-light)' }} />
          <input 
            type="text" 
            placeholder="Search by return ID or order ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>RETURN ID</th>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map(r => (
              <tr 
                key={r.id} 
                className={`${selectedReturnId === r.id ? styles.selectedRow : ''} ${r.isNew ? styles.newRow : ''}`}
                onClick={() => handleRowClick(r.id)}
              >
                <td><input type="checkbox" onClick={e => e.stopPropagation()} /></td>
                <td style={{ fontWeight: 600 }}>
                  {r.id}
                  {r.isNew && <span className={styles.newBadge}>New</span>}
                </td>
                <td>{r.orderId}</td>
                <td>
                  <div className={styles.customerCell}>
                    <img src={r.avatar} alt={r.customer} className={styles.avatar} />
                    <span style={{ fontWeight: 600 }}>{r.customer}</span>
                  </div>
                </td>
                <td>{r.date}</td>
                <td style={{ color: 'var(--color-charcoal-light)' }}>{r.reason}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleRowClick(r.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReturns.length === 0 && !loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-charcoal-light)' }}>
                  No returns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedReturn && (
        <div className={styles.modalOverlay} onClick={() => setSelectedReturnId(null)}>
          <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Return Details – {selectedReturn.id}</h2>
              <button className={styles.closeModalBtn} onClick={() => setSelectedReturnId(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalGrid}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Customer Information</h3>
                  <div className={styles.customerCell}>
                    <img src={selectedReturn.avatar} alt={selectedReturn.customer} className={styles.avatar} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{selectedReturn.customer}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-charcoal-light)' }}>Customer Email</span>
                    </div>
                  </div>
                  <a href="#" style={{ color: 'var(--color-burgundy)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>View Full Profile</a>
                </div>
                
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Return Shipping Address</h3>
                  <div style={{ fontSize: '13px', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                    {selectedReturn.customer}<br />
                    123 Fashion Street,<br />
                    Colombo 05,<br />
                    Sri Lanka
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Return Items (1)</h3>
                  
                  {selectedReturn.items?.map((item: any, idx: number) => (
                    <div key={idx} className={styles.returnItem}>
                      <img src="/floral-maxi-1.jpg" alt="Item" />
                      <div className={styles.returnItemDetails}>
                        <div className={styles.returnItemName}>{item.name}</div>
                        <div className={styles.returnItemProps}>
                          <span>Qty: {item.qty}</span>
                        </div>
                      </div>
                      <div className={styles.returnItemPrice}>
                        LKR {(item.price * item.qty).toLocaleString('en-LK')}
                      </div>
                    </div>
                  ))}

                  <div className={styles.reasonBlock}>
                    <h4 className={styles.infoTitle}>Reason for Return</h4>
                    <p className={styles.reasonText}>{selectedReturn.reason}</p>
                    
                    <h4 className={styles.infoTitle} style={{ marginTop: '16px' }}>Customer Note</h4>
                    <p className={styles.noteText}>{selectedReturn.note}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Return Summary</h3>
                  
                  <div className={styles.summaryRow}>
                    <span>Return Status</span>
                    <span className={`${styles.statusBadge} ${getStatusClass(selectedReturn.status)}`}>{selectedReturn.status}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Refund Method</span>
                    <span>Bank Transfer</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Refund Amount</span>
                    <span>{selectedReturn.total}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Return Date</span>
                    <span>{selectedReturn.date}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Order ID</span>
                    <span>{selectedReturn.orderId}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Tracking Number</span>
                    <span>-</span>
                  </div>
                </div>
              </div>
            </div>
            
            {(selectedReturn.status === 'Requested' || selectedReturn.status === 'Under Review') && (
              <div className={styles.actionButtons}>
                <button className={styles.btnReject} onClick={() => handleUpdateStatus(selectedReturn.id, 'Rejected')}>
                  Reject Return
                </button>
                <button className={styles.btnApprove} onClick={() => handleUpdateStatus(selectedReturn.id, 'Approved')}>
                  Approve Return
                </button>
              </div>
            )}
            
            <div className={styles.bottomGrid}>
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Return Timeline</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineNode}>
                    <div className={`${styles.nodeDot} ${selectedReturn.status !== 'Requested' ? styles.approved : styles.active}`}><Check size={14} /></div>
                    <span className={styles.nodeTitle}>Return Requested</span>
                    <span className={styles.nodeDate}>{selectedReturn.date}</span>
                  </div>
                  <div className={styles.timelineNode}>
                    <div className={`${styles.nodeDot} ${selectedReturn.status === 'Approved' ? styles.approved : (selectedReturn.status === 'Rejected' ? styles.active : '')}`}></div>
                    <span className={styles.nodeTitle}>Under Review</span>
                    <span className={styles.nodeDate}>By Admin</span>
                  </div>
                  <div className={styles.timelineNode}>
                    <div className={`${styles.nodeDot} ${selectedReturn.status === 'Refunded' ? styles.approved : (selectedReturn.status === 'Approved' ? styles.active : '')}`}></div>
                    <span className={styles.nodeTitle}>{selectedReturn.status === 'Rejected' ? 'Rejected' : 'Approved'}</span>
                    <span className={styles.nodeDate}>-</span>
                  </div>
                  <div className={styles.timelineNode}>
                    <div className={`${styles.nodeDot} ${selectedReturn.status === 'Refunded' ? styles.active : ''}`}></div>
                    <span className={styles.nodeTitle}>Refunded</span>
                    <span className={styles.nodeDate}>-</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Customer Messages</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <img src={selectedReturn.avatar} alt="Avatar" className={styles.avatar} style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{selectedReturn.customer}</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-charcoal-light)', marginLeft: 'auto' }}>{selectedReturn.date}</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '4px', fontSize: '12px', color: 'var(--color-charcoal)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  {selectedReturn.note}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
