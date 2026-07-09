'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './MyOrders.module.css';
import ReturnModal from './ReturnModal';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [returnOrder, setReturnOrder] = useState<any | null>(null);
  const user = useAuthStore(state => state.user);
  const { toast } = require('react-hot-toast');

  useEffect(() => {
    if (!user) return;
    
    fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const isEligibleForReturn = (order: any) => {
    if (order.status !== 'Delivered') return false;
    if (!order.deliveryDate) return true; // Backwards compatibility for old orders
    
    const deliveryDate = new Date(order.deliveryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7;
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Processing': return styles.statusProcessing;
      case 'Shipped': return styles.statusShipped;
      case 'Delivered': return styles.statusDelivered;
      case 'Cancelled': return styles.statusCancelled;
      case 'Return Requested': return styles.statusReturnRequested;
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>My Orders</h2>
        <div className={styles.orderList}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.orderCard} style={{ opacity: 0.7, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
              <div className={styles.orderHeader}>
                <div style={{ width: '150px', height: '24px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                <div style={{ width: '100px', height: '24px', background: '#f3f4f6', borderRadius: '99px' }}></div>
              </div>
              <div className={styles.orderBody}>
                <div className={styles.orderItem}>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemImageWrap} style={{ background: '#f3f4f6' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ width: '200px', height: '20px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                      <div style={{ width: '100px', height: '16px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div style={{ width: '80px', height: '20px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div className={styles.orderTotal}>
                <div style={{ width: '60px', height: '24px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                <div style={{ width: '100px', height: '24px', background: '#f3f4f6', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Orders</h2>
      
      <div className={styles.orderList}>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>#ORD-{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={styles.orderDate}>Placed on {order.date || 'a previous date'}</span>
                </div>
                <span className={`${styles.orderStatus} ${getStatusClass(order.status || 'Processing')}`}>
                  {order.status || 'Processing'}
                </span>
              </div>
              
              <div className={styles.orderBody}>
                {order.items?.map((item: any, idx: number) => {
                  const product = item.product || item;
                  const price = product.price || 0;
                  const qty = item.qty || 1;
                  return (
                    <div key={idx} className={styles.orderItem}>
                      <div className={styles.itemDetails}>
                        <div className={styles.itemImageWrap}>
                          <img src={product.images?.[0] || product.image || '/logo.svg'} alt={product.name || 'Product'} className={styles.itemImage} />
                        </div>
                        <div>
                          <p className={styles.itemName}>{qty}x {product.name || 'Product'}</p>
                          {(item.color || item.size) && (
                            <p className={styles.itemVariant}>
                              {item.color && <span>Color: {item.color}</span>}
                              {item.color && item.size && <span> | </span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={styles.itemPrice}>LKR {(price * qty).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className={styles.orderTotal}>
                <span>Total</span>
                <span>{order.total}</span>
              </div>

              {/* If eligible for return, show Return button */}
              {isEligibleForReturn(order) && (
                <div className={styles.orderActions}>
                  <button className={styles.returnBtn} onClick={() => setReturnOrder(order)}>
                    Return Items
                  </button>
                </div>
              )}
              {/* Mock: If return already submitted, we could check DB. For now, assume if not eligible, it's either returned, or past 7 days, or not delivered */}
            </div>
          ))
        )}
      </div>

      {returnOrder && (
        <ReturnModal 
          order={returnOrder} 
          onClose={() => setReturnOrder(null)} 
          onSubmit={(data) => {
            toast.success(`Return requested successfully! Your Return ID is ${data.id}.`);
            // Update local state to reflect that it is now "Return Requested"
            setOrders(prev => prev.map(o => o.id === returnOrder.id ? { ...o, status: 'Return Requested' } : o));
            setReturnOrder(null);
          }} 
        />
      )}
    </div>
  );
}
