'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './orders.module.css';
import { Search, ChevronDown, Calendar, MoreVertical, X, CheckCircle, ChevronLeft, ChevronRight, FileText, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const TABS = [
    { name: 'All Orders', count: orders.length },
    { name: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { name: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { name: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { name: 'Out for Delivery', count: orders.filter(o => o.status === 'Out for Delivery').length },
    { name: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { name: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
  ];

  const filteredOrders = orders.filter(o => {
    // Tab filter
    if (activeTab !== 'All Orders' && o.status !== activeTab) return false;
    
    // Status filter
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!o.id.toLowerCase().includes(search) &&
          !o.customer.toLowerCase().includes(search) &&
          !o.phone.includes(search)) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilter) {
      const orderDate = new Date(o.date);
      const filterDateObj = new Date(dateFilter);
      if (orderDate.toDateString() !== filterDateObj.toDateString()) return false;
    }
    
    return true;
  });

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort newest first
        data.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Real-time polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrderId) return;
    try {
      const updateData: any = { status };
      if (status === 'Delivered') {
        updateData.deliveryDate = new Date().toISOString();
      }
      
      await updateDoc(doc(db, 'orders', selectedOrderId), updateData);
      setOrders(prev => prev.map(o => o.id === selectedOrderId ? { ...o, ...updateData } : o));
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      // Close dropdown
      setActionMenuOpenId(null);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Pending': return styles.statusPending;
      case 'Processing': return styles.statusProcessing;
      case 'Shipped': return styles.statusShipped;
      case 'Delivered': return styles.statusDelivered;
      case 'Out for Delivery': return styles.statusOutForDelivery;
      case 'Cancelled': return styles.statusCancelled;
      default: return '';
    }
  };

  const handleRowClick = async (id: string) => {
    if (selectedOrderId === id) {
      setSelectedOrderId(null); // Toggle off if clicking same row
    } else {
      setSelectedOrderId(id);
      
      const clickedOrder = orders.find(o => o.id === id);
      if (clickedOrder && clickedOrder.isNew) {
        try {
          // Immediately update UI
          setOrders(prev => prev.map(o => o.id === id ? { ...o, isNew: false } : o));
          await updateDoc(doc(db, 'orders', id), { isNew: false });
        } catch (error) {
          console.error('Failed to mark order as read', error);
        }
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, 'orders', deleteConfirmId));
      setOrders(prev => prev.filter(o => o.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      toast.success('Order deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete order', err);
      toast.error(err.message || 'Failed to delete order due to permission or network issue.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
    setActionMenuOpenId(null);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className={styles.container}>
      {/* Click Catcher for Action Menu */}
      {actionMenuOpenId && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
          onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(null); }}
        />
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Orders</h1>
        <div className={styles.breadcrumbs}>
          <span>Dashboard</span> &gt; Orders
        </div>
      </div>

      {/* Tabs */}
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

      {/* Filters */}
      <div className={styles.filtersRow}>
        <select 
          className={styles.filterSelect} 
          style={{ appearance: 'none', cursor: 'pointer', outline: 'none' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
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
            placeholder="Search by order ID, customer or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYMENT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr 
                key={order.id} 
                className={`${selectedOrderId === order.id ? styles.selectedRow : ''} ${order.isNew ? styles.newRow : ''}`}
                onClick={() => handleRowClick(order.id)}
              >
                <td><input type="checkbox" onClick={e => e.stopPropagation()} /></td>
                <td style={{ fontWeight: 600 }}>
                  {order.id}
                  {order.isNew && <span className={styles.newBadge}>New</span>}
                </td>
                <td>
                  <div className={styles.customerCell}>
                    <img src={order.avatar} alt={order.customer} className={styles.avatar} />
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{order.customer}</span>
                      <span className={styles.customerPhone}>{order.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.dateCell}>
                    <span>{order.date}</span>
                    <span className={styles.timeText}>{order.time}</span>
                  </div>
                </td>
                <td className={styles.totalText}>{order.total}</td>
                <td>{order.payment}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionMenuWrapper}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActionMenuOpenId(actionMenuOpenId === order.id ? null : order.id); 
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {actionMenuOpenId === order.id && (
                      <div className={styles.actionMenu}>
                        <button className={styles.actionMenuItem} onClick={(e) => { e.stopPropagation(); handleRowClick(order.id); setActionMenuOpenId(null); }}>
                          <Eye size={14} /> View Details
                        </button>
                        <button className={`${styles.actionMenuItem} ${styles.danger}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(order.id); }}>
                          <Trash2 size={14} /> Delete Order
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing {filteredOrders.length > 0 ? 1 : 0} to {filteredOrders.length} of {filteredOrders.length} orders</span>
          <div className={styles.pageControls}>
            <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span style={{ color: 'var(--color-charcoal-light)', margin: '0 4px' }}>...</span>
            <button className={styles.pageBtn}>26</button>
            <button className={styles.pageBtn}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className={styles.orderDetailsSection} onClick={() => setSelectedOrderId(null)}>
          <div className={styles.detailsContent} onClick={e => e.stopPropagation()}>
            <div className={styles.detailsHeader}>
              <h2 className={styles.detailsTitle}>Order Details - {selectedOrder.id}</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedOrderId(null)}>
                <X size={20} />
              </button>
            </div>

          <div className={styles.detailsGrid}>
            {/* Customer Info */}
            <div className={styles.detailsColumn}>
              <div className={styles.infoBlock}>
                <h3 className={styles.columnTitle}>Customer Information</h3>
                <div className={styles.customerCell} style={{ marginBottom: 8 }}>
                  <img src={selectedOrder.avatar} className={styles.avatar} style={{ width: 40, height: 40 }} />
                  <div className={styles.customerInfo}>
                    <span className={styles.customerName}>{selectedOrder.customer}</span>
                    <span className={styles.customerPhone}>{selectedOrder.phone}</span>
                  </div>
                </div>
                <span className={styles.infoValue} style={{ color: 'var(--color-charcoal-light)' }}>
                  {selectedOrder.customer.toLowerCase().replace(' ', '.')}@email.com
                </span>
                <button className={styles.viewProfileBtn}>View Full Profile</button>
              </div>

              <div className={styles.infoBlock} style={{ marginTop: 24 }}>
                <h3 className={styles.columnTitle}>Shipping Address</h3>
                <div className={styles.infoValue}>
                  {selectedOrder.customer}<br />
                  {selectedOrder.address || "No. 45, Lake Road, Moratuwa, Sri Lanka 10104"}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                <select 
                  className={styles.updateStatusBtn} 
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  style={{ appearance: 'none', cursor: 'pointer', paddingRight: '32px', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B2335%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto' }}
                >
                  <option value="Pending">Update: Pending</option>
                  <option value="Processing">Update: Processing</option>
                  <option value="Shipped">Update: Shipped</option>
                  <option value="Out for Delivery">Update: Out for Delivery</option>
                  <option value="Delivered">Update: Delivered</option>
                  <option value="Cancelled">Update: Cancelled</option>
                </select>
                <button type="button" className={styles.viewReceiptBtn} onClick={() => setShowReceipt(true)}>
                  View Payment Receipt
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className={styles.detailsColumn}>
              <h3 className={styles.columnTitle}>Order Items ({selectedOrder.items?.length || 0})</h3>
              
              {selectedOrder.items?.map((item: any, i: number) => (
                <div key={i} className={styles.orderItem}>
                  <img src={item.product?.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80"} alt={item.product?.name} className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product?.name || "Product"}</span>
                    <span className={styles.itemMeta}>Size: {item.size} | Color: {item.color}</span>
                    <span className={styles.itemMeta}>SKU: {item.product?.id || `MM-PROD-${i}`}</span>
                    <span className={styles.itemMeta}>Qty: {item.qty}</span>
                  </div>
                  <div className={styles.itemPrice}>LKR {(item.product?.price * item.qty).toLocaleString('en-LK')}</div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={styles.detailsColumn}>
              <h3 className={styles.columnTitle}>Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>{selectedOrder.total}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Delivery Charge</span>
                <span className={styles.summaryValue}>LKR 250</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Discount</span>
                <span className={styles.summaryValue}>- LKR 0</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{selectedOrder.total}</span>
              </div>

              <div className={styles.infoBlock} style={{ marginTop: 24, gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.infoLabel}>Payment Method</span>
                  <span className={styles.infoValue} style={{ fontWeight: 600 }}>{selectedOrder.payment}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.infoLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${getStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.infoLabel}>Order Date</span>
                  <span className={styles.infoValue}>{selectedOrder.date}, {selectedOrder.time}</span>
                </div>
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Note</span>
                  <span className={styles.infoValue}>Leave at the gate.</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {showReceipt && (
        <div className={styles.modalOverlay} style={{ zIndex: 999999 }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Payment Receipt</h3>
              <button className={styles.closeBtn} onClick={() => setShowReceipt(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {selectedOrder?.receiptImage ? (
                <div style={{ textAlign: 'center', width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {selectedOrder.receiptImage.startsWith('data:application/pdf') ? (
                    <embed src={selectedOrder.receiptImage} type="application/pdf" width="100%" height="100%" />
                  ) : (
                    <img src={selectedOrder.receiptImage} alt="Payment Receipt" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                  )}
                </div>
              ) : (
                <div className={styles.receiptBox}>
                  <FileText size={48} className={styles.receiptIcon} />
                  <div className={styles.receiptText}>
                    No receipt uploaded for Order {selectedOrderId}
                  </div>
                  <div style={{ color: 'var(--color-charcoal-light)', fontSize: 13, maxWidth: '250px' }}>
                    This order either used Cash on Delivery, or the customer did not upload a receipt.
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setShowReceipt(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Toast */}
      {updateSuccess && (
        <div className={styles.toast}>
          <CheckCircle size={18} />
          Status successfully updated!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.deleteModalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.deleteModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.deleteIconWrapper}>
              <AlertTriangle size={24} />
            </div>
            <h3 className={styles.deleteModalTitle}>Delete Order?</h3>
            <p className={styles.deleteModalText}>
              Are you sure you want to completely delete Order {deleteConfirmId}? This action cannot be undone and will permanently erase all data associated with it.
            </p>
            <div className={styles.deleteModalActions}>
              <button className={styles.cancelDeleteBtn} onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={handleDeleteOrder}>
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
