'use client';

import React from 'react';
import styles from './dashboard.module.css';
import { 
  ShoppingBag, TrendingUp, Users, Box, AlertTriangle, 
  ChevronDown, MoreVertical 
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders
        const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        setTotalOrders(orders.length);
        
        // Calculate Revenue (parse from string 'LKR 3,250' or similar)
        let revenue = 0;
        const statusCounts: Record<string, number> = { 'Pending': 0, 'Processing': 0, 'Shipped': 0, 'Delivered': 0 };
        const uniqueCustomers = new Set();
        
        orders.forEach(order => {
          if (order.status !== 'Cancelled') {
            const amount = typeof order.total === 'string' ? parseFloat(order.total.replace(/[^0-9.-]+/g, "")) : (order.total || 0);
            revenue += amount;
          }
          if (order.status && statusCounts[order.status] !== undefined) {
            statusCounts[order.status]++;
          } else if (order.status) {
            statusCounts[order.status] = 1;
          }
          if (order.customerEmail || order.email) {
            uniqueCustomers.add(order.customerEmail || order.email);
          }
        });
        
        setTotalRevenue(revenue);
        setTotalCustomers(uniqueCustomers.size);
        
        // Donut Chart Data
        const colors = ['#60a5fa', '#f59e0b', '#c084fc', '#4ade80', '#ef4444'];
        const chartData = Object.keys(statusCounts).filter(k => statusCounts[k] > 0).map((key, i) => ({
          name: key,
          value: statusCounts[key],
          color: colors[i % colors.length]
        }));
        setOrderStatusData(chartData);

        // Recent Orders
        setRecentOrders(orders.slice(0, 5).map(o => ({
          id: o.id,
          customer: o.customer || o.customerName || 'Unknown',
          date: new Date(o.createdAt).toLocaleDateString(),
          amount: typeof o.total === 'string' ? o.total : `LKR ${o.total?.toLocaleString()}`,
          status: o.status,
          payment: o.payment || o.paymentMethod || 'Unknown',
          avatar: o.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(o.customer || 'U')}&backgroundColor=6B2335&textColor=ffffff`
        })));

        // Basic mock timeline for sales (until we have real historical grouping)
        setSalesData([
          { name: 'Week 1', value: revenue * 0.2 },
          { name: 'Week 2', value: revenue * 0.3 },
          { name: 'Week 3', value: revenue * 0.1 },
          { name: 'This Week', value: revenue * 0.4 },
        ]);

        // Fetch Products
        const productsSnap = await getDocs(collection(db, 'products'));
        const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        setActiveProducts(products.filter(p => p.status === 'Active').length);
        
        // Low Stock
        const low = products.filter(p => p.stock > 0 && p.stock <= 5).slice(0, 4);
        setLowStock(low.map(p => ({
          name: p.name,
          count: p.stock,
          img: p.images?.[0] || '/logo.svg'
        })));
        
        // Top Selling (mocking rank and sold count until we have actual sales data in products)
        setTopSelling(products.slice(0, 5).map((p, idx) => ({
          rank: idx + 1,
          name: p.name,
          sold: Math.floor(Math.random() * 100) + 10,
          img: p.images?.[0] || '/logo.svg'
        })));
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', color: '#6b2335' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      <span style={{ fontWeight: 500, opacity: 0.8 }}>Loading dashboard metrics...</span>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Live Metrics Overview</p>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconPink}`}>
              <ShoppingBag size={20} />
            </div>
            <span className={styles.metricTitle}>Total Orders</span>
          </div>
          <div className={styles.metricValue}>{totalOrders}</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>Live Data</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconGreen}`}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.metricTitle}>Total Revenue</span>
          </div>
          <div className={styles.metricValue}>LKR {totalRevenue.toLocaleString()}</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>Live Data</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconPink}`}>
              <Users size={20} />
            </div>
            <span className={styles.metricTitle}>Total Customers</span>
          </div>
          <div className={styles.metricValue}>{totalCustomers}</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>Live Data</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconPurple}`}>
              <Box size={20} />
            </div>
            <span className={styles.metricTitle}>Active Products</span>
          </div>
          <div className={styles.metricValue}>{activeProducts}</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>Live Data</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconOrange}`}>
              <AlertTriangle size={20} />
            </div>
            <span className={styles.metricTitle}>Low Stock Items</span>
          </div>
          <div className={styles.metricValue}>{lowStock.length}</div>
          <div className={styles.metricBottom}>
            <span className={styles.changeNeg}>Needs Restock</span>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className={styles.middleGrid}>
        
        {/* Line Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Sales Overview</span>
            <button className={styles.dropdownBtn}>Last 30 Days <ChevronDown size={14}/></button>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#db2777" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888'}}
                  tickFormatter={(val) => val === 0 ? 'LKR 0' : `LKR ${(val/1000000).toFixed(2)}M`} 
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#db2777" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Order Status</span>
            <button className={styles.viewAllBtn}>View All</button>
          </div>
          <div className={styles.chartArea} style={{ height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.legendList}>
            {orderStatusData.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <div className={styles.legendLeft}>
                  <div className={styles.legendDot} style={{ background: item.color }} />
                  {item.name}
                </div>
                <div className={styles.legendRight}>
                  {item.value} ({(item.value / 256 * 100).toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Low Stock Alert</span>
            <button className={styles.viewAllBtn}>View All</button>
          </div>
          <div className={styles.lowStockList}>
            {lowStock.map((item, idx) => (
              <div key={idx} className={styles.stockItem}>
                <img src={item.img} alt={item.name} className={styles.stockImage} />
                <div className={styles.stockInfo}>
                  <div className={styles.stockName}>{item.name}</div>
                  <div className={styles.stockCount}>Only {item.count} left in stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomGrid}>
        
        {/* Recent Orders Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Recent Orders</span>
            <button className={styles.dropdownBtn}>View All Orders</button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td><span className={styles.orderId}>{order.id}</span></td>
                    <td>
                      <div className={styles.customerInfo}>
                        <img src={order.avatar} alt={order.customer} className={styles.customerAvatar} />
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[(order.status || 'Pending').toLowerCase().replace(' ', '')] || styles.processing}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>{order.payment}</td>
                    <td>
                      <button className={styles.actionBtn}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling & Banner */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Top Selling Products</span>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
            <div className={styles.topSellingList}>
              {topSelling.map((item: any, idx: number) => (
                <div key={idx} className={styles.sellingItem}>
                  <span className={styles.sellingRank}>{item.rank}</span>
                  <img src={item.img} alt={item.name} className={styles.sellingImage} />
                  <span className={styles.sellingName}>{item.name}</span>
                  <span className={styles.sellingCount}>{item.sold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
