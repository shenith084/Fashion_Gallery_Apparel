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

// Data for Line Chart
const salesData = [
  { name: 'May 25', value: 0 },
  { name: 'May 30', value: 300000 },
  { name: 'Jun 04', value: 750000 },
  { name: 'Jun 09', value: 200000 },
  { name: 'Jun 14', value: 650000 },
  { name: 'Jun 19', value: 400000 },
  { name: 'Jun 24', value: 1000000 },
  { name: 'Jun 29', value: 1300000 },
];

// Data for Donut Chart
const orderStatusData = [
  { name: 'Pending', value: 12, color: '#60a5fa' },
  { name: 'Processing', value: 28, color: '#f59e0b' },
  { name: 'Shipped', value: 86, color: '#c084fc' },
  { name: 'Out for Delivery', value: 45, color: '#8b5cf6' },
  { name: 'Delivered', value: 85, color: '#4ade80' },
];

const RECENT_ORDERS = [
  { id: '#MM-2026-1025', customer: 'Nimali Perera', date: '01 Jul 2026', amount: 'LKR 3,250', status: 'Processing', payment: 'Cash on Delivery', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Nimali+Perera&backgroundColor=6B2335&textColor=ffffff' },
  { id: '#MM-2026-1024', customer: 'Tharushi Silva', date: '01 Jul 2026', amount: 'LKR 2,890', status: 'Shipped', payment: 'Bank Transfer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tharushi+Silva&backgroundColor=6B2335&textColor=ffffff' },
  { id: '#MM-2026-1023', customer: 'Hasini Wijesinghe', date: '30 Jun 2026', amount: 'LKR 4,150', status: 'Delivered', payment: 'Cash on Delivery', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Hasini+Wijesinghe&backgroundColor=6B2335&textColor=ffffff' },
  { id: '#MM-2026-1022', customer: 'Dilini Fernando', date: '30 Jun 2026', amount: 'LKR 1,950', status: 'Processing', payment: 'Bank Transfer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Dilini+Fernando&backgroundColor=6B2335&textColor=ffffff' },
  { id: '#MM-2026-1021', customer: 'Sachini Jayawardena', date: '29 Jun 2026', amount: 'LKR 3,790', status: 'Out for Delivery', payment: 'Cash on Delivery', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sachini+Jayawardena&backgroundColor=6B2335&textColor=ffffff' },
];

const LOW_STOCK = [
  { name: 'Floral Maxi Dress', count: 2, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&q=80' },
  { name: 'Linen Puff Sleeve Top', count: 3, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80' },
  { name: 'Pleated Long Skirt', count: 4, img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=100&q=80' },
  { name: 'Casual Blazer', count: 2, img: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=100&q=80' },
];

const TOP_SELLING = [
  { rank: 1, name: 'Floral Maxi Dress', sold: 132, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&q=80' },
  { rank: 2, name: 'Linen Puff Sleeve Top', sold: 98, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80' },
  { rank: 3, name: 'Pleated Long Skirt', sold: 75, img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=100&q=80' },
  { rank: 4, name: 'Casual Blazer', sold: 62, img: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=100&q=80' },
  { rank: 5, name: 'Printed Wrap Dress', sold: 55, img: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=100&q=80' },
];

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back, Senith Chanidu 👋</p>
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
          <div className={styles.metricValue}>256</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>↑ 18.6%</span>
            <span className={styles.changeText}>vs last 30 days</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconGreen}`}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.metricTitle}>Total Revenue</span>
          </div>
          <div className={styles.metricValue}>LKR 1,250,000</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>↑ 23.4%</span>
            <span className={styles.changeText}>vs last 30 days</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconPink}`}>
              <Users size={20} />
            </div>
            <span className={styles.metricTitle}>Total Customers</span>
          </div>
          <div className={styles.metricValue}>1,245</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>↑ 15.2%</span>
            <span className={styles.changeText}>vs last 30 days</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconPurple}`}>
              <Box size={20} />
            </div>
            <span className={styles.metricTitle}>Products</span>
          </div>
          <div className={styles.metricValue}>58</div>
          <div className={styles.metricBottom}>
            <span className={styles.changePos}>↑ 5.1%</span>
            <span className={styles.changeText}>vs last 30 days</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div className={`${styles.metricIconWrap} ${styles.iconOrange}`}>
              <AlertTriangle size={20} />
            </div>
            <span className={styles.metricTitle}>Low Stock Items</span>
          </div>
          <div className={styles.metricValue}>6</div>
          <div className={styles.metricBottom}>
            <span className={styles.changeNeg}>↓ 12.5%</span>
            <span className={styles.changeText}>vs last 30 days</span>
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
            {LOW_STOCK.map((item, idx) => (
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
                {RECENT_ORDERS.map((order, idx) => {
                  let badgeClass = styles.bgProcessing;
                  if (order.status === 'Shipped') badgeClass = styles.bgShipped;
                  if (order.status === 'Delivered') badgeClass = styles.bgDelivered;
                  if (order.status === 'Out for Delivery') badgeClass = styles.bgOut;

                  return (
                    <tr key={idx}>
                      <td className={styles.orderId}>{order.id}</td>
                      <td>
                        <div className={styles.customerCell}>
                          <img src={order.avatar} alt={order.customer} className={styles.customerAvatar} />
                          {order.customer}
                        </div>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.amount}</td>
                      <td><span className={`${styles.statusBadge} ${badgeClass}`}>{order.status}</span></td>
                      <td>{order.payment}</td>
                      <td>
                        <button className={styles.actionBtn}><MoreVertical size={14}/></button>
                      </td>
                    </tr>
                  )
                })}
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
              {TOP_SELLING.map((item, idx) => (
                <div key={idx} className={styles.sellingItem}>
                  <span className={styles.sellingRank}>{item.rank}</span>
                  <img src={item.img} alt={item.name} className={styles.sellingImage} />
                  <span className={styles.sellingName}>{item.name}</span>
                  <span className={styles.sellingCount}>{item.sold} sold</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.bannerCard}>
            <div className={styles.bannerTitle}>
              <span style={{ fontSize: '16px' }}>❝</span> New Collection Alert!
            </div>
            <p className={styles.bannerDesc}>Summer Collection '24 is live now. Update banners and announcements to promote your new arrivals.</p>
            <button className={styles.bannerBtn}>Manage Banners</button>
            <img 
              src="https://images.unsplash.com/photo-1490750967868-88cb44cb2720?w=200&q=80" 
              alt="Flowers" 
              className={styles.bannerDecor} 
            />
          </div>
        </div>

      </div>

    </div>
  );
}
