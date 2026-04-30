'use client';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, ArrowRight, Activity,
  DollarSign, BarChart2, Store, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import Link from 'next/link';
import {
  MOCK_KPI, MOCK_CHART_DATA, MOCK_PAYMENT_METHODS,
  MOCK_TRANSACTIONS, MOCK_GATEWAYS,
  formatCurrency, formatNumber, formatDate,
} from '@/lib/mock-data';

const recentTxns = [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

const statusConfig = {
  SUCCESS:        { color: 'var(--success)', bg: 'badge-success', icon: CheckCircle2, label: 'Success' },
  FAILED:         { color: 'var(--danger)',  bg: 'badge-danger',  icon: XCircle,      label: 'Failed' },
  PENDING:        { color: 'var(--warning)', bg: 'badge-warning', icon: Clock,        label: 'Pending' },
  REFUNDED:       { color: 'var(--info)',    bg: 'badge-info',    label: 'Refunded' },
  PARTIAL_REFUND: { color: 'var(--info)',    bg: 'badge-info',    label: 'Partial Refund' },
} as const;

const KPI_CARDS = [
  {
    label: 'Total Revenue (30d)',
    value: formatCurrency(MOCK_KPI.totalRevenue),
    change: MOCK_KPI.revenueChange,
    icon: DollarSign,
    gradient: 'stat-gradient-indigo',
    accent: '#6366F1',
  },
  {
    label: 'Transactions (30d)',
    value: formatNumber(MOCK_KPI.totalTransactions),
    change: MOCK_KPI.transactionsChange,
    icon: Activity,
    gradient: 'stat-gradient-green',
    accent: '#10B981',
  },
  {
    label: 'Success Rate',
    value: `${MOCK_KPI.successRate}%`,
    change: MOCK_KPI.successRateChange,
    icon: BarChart2,
    gradient: 'stat-gradient-amber',
    accent: '#F59E0B',
  },
  {
    label: 'Active Merchants',
    value: formatNumber(MOCK_KPI.activeMerchants),
    change: MOCK_KPI.merchantsChange,
    icon: Store,
    gradient: 'stat-gradient-blue',
    accent: '#3B82F6',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
        borderRadius: 8, padding: '10px 14px', fontSize: 13,
        boxShadow: 'var(--shadow-elevated)',
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 4, fontSize: 11 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' && p.dataKey === 'revenue'
              ? formatCurrency(p.value)
              : formatNumber(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Overview
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          Payment orchestration metrics • Last 30 days
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {KPI_CARDS.map(({ label, value, change, icon: Icon, gradient, accent }) => (
          <div key={label} className={`card animate-fadeInUp ${gradient}`} style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: `${accent}10`,
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${accent}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} style={{ color: accent }} />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, fontWeight: 600,
                color: change >= 0 ? 'var(--success)' : 'var(--danger)',
                background: change >= 0 ? 'var(--success-muted)' : 'var(--danger-muted)',
                padding: '3px 8px', borderRadius: 99,
              }}>
                {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(change)}%
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Revenue Trend */}
        <div className="card animate-fadeInUp" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Revenue Trend</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Daily revenue over last 30 days</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['7D', '30D', '90D'].map((t, i) => (
                <button key={t} className={`chip ${i === 1 ? 'active' : ''}`} style={{ fontSize: 11, padding: '3px 8px' }}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#6366F1" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="card animate-fadeInUp" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Payment Methods</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Distribution by volume</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={MOCK_PAYMENT_METHODS} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                {MOCK_PAYMENT_METHODS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {MOCK_PAYMENT_METHODS.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: m.color }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Transaction Volume */}
        <div className="card animate-fadeInUp" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Transaction Volume</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Success vs Failed daily</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_CHART_DATA.slice(-14)} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
              <Bar dataKey="success" name="Success" stackId="a" fill="#10B981" radius={[0,0,0,0]} />
              <Bar dataKey="failed" name="Failed" stackId="a" fill="#EF4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gateway Success Rates */}
        <div className="card animate-fadeInUp" style={{ padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Gateway Performance</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Success rate by gateway</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_GATEWAYS.map(gw => (
              <div key={gw.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{gw.logo}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{gw.name}</span>
                    {gw.status === 'DEGRADED' && <span className="badge badge-warning" style={{ fontSize: 10, padding: '1px 6px' }}>Degraded</span>}
                    {gw.status === 'INACTIVE' && <span className="badge badge-muted" style={{ fontSize: 10, padding: '1px 6px' }}>Offline</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: gw.successRate >= 95 ? 'var(--success)' : gw.successRate >= 90 ? 'var(--warning)' : 'var(--danger)' }}>
                    {gw.successRate}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${gw.successRate}%`,
                      background: gw.successRate >= 95
                        ? 'linear-gradient(90deg, #10B981, #34D399)'
                        : gw.successRate >= 90
                        ? 'linear-gradient(90deg, #F59E0B, #FCD34D)'
                        : 'linear-gradient(90deg, #EF4444, #F87171)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card animate-fadeInUp" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Transactions</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest payment activity</div>
          </div>
          <Link href="/transactions" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map(txn => {
                const sc = statusConfig[txn.status];
                return (
                  <tr key={txn.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-primary-hover)' }}>{txn.id}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{txn.merchantName}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(txn.amount, txn.currency)}</td>
                    <td>
                      <span className="badge badge-muted">{txn.paymentMethod}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{txn.gateway}</td>
                    <td>
                      <span className={`badge ${sc.bg}`}>{sc.label ?? txn.status}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(txn.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
