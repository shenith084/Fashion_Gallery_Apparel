export default function DashboardPage() {
  return (
    <div>
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Metric Cards placeholders */}
        <div style={{ background: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--color-charcoal-light)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Orders</p>
          <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-burgundy)', marginTop: 'var(--space-2)' }}>12</p>
        </div>
        <div style={{ background: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--color-charcoal-light)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</p>
          <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-burgundy)', marginTop: 'var(--space-2)' }}>Rs. 45,900</p>
        </div>
        <div style={{ background: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--color-charcoal-light)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock Items</p>
          <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-warning)', marginTop: 'var(--space-2)' }}>4</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Recent Activity</h2>
        <p style={{ color: 'var(--color-charcoal-light)' }}>No recent activity to display.</p>
      </div>
    </div>
  );
}
