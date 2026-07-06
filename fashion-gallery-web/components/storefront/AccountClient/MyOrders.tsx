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
    if (!order.deliveryDate) return false;
    
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
      default: return '';
    }
  };

  if (loading) return <div>Loading orders...</div>;

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
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.orderDate}>Placed on {order.date}</span>
                </div>
                <span className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className={styles.orderBody}>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className={styles.orderItem}>
                    <span>{item.qty}x {item.name}</span>
                    <span>LKR {(item.price * item.qty).toLocaleString('en-LK')}</span>
                  </div>
                ))}
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
            alert('Return requested successfully!');
            setReturnOrder(null);
          }} 
        />
      )}
    </div>
  );
}
