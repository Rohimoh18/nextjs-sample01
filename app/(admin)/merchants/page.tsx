'use client';
import { useState } from 'react';
import { Search, Plus, RefreshCw, Globe, Mail, Phone, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { MOCK_MERCHANTS, formatCurrency, formatDate, formatNumber } from '@/lib/mock-data';
import { Merchant } from '@/types';

const STATUS_ICONS: Record<Merchant['status'], React.ReactNode> = {
  ACTIVE:    <CheckCircle2 size={12} />,
  INACTIVE:  <Clock size={12} />,
  PENDING:   <Clock size={12} />,
  SUSPENDED: <XCircle size={12} />,
};
const STATUS_BADGE: Record<Merchant['status'], string> = {
  ACTIVE: 'badge-success', INACTIVE: 'badge-muted', PENDING: 'badge-warning', SUSPENDED: 'badge-danger',
};
const KYC_BADGE: Record<Merchant['kycStatus'], string> = {
  VERIFIED: 'badge-success', PENDING: 'badge-warning', REJECTED: 'badge-danger',
};

export default function MerchantsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = MOCK_MERCHANTS.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Merchants</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{MOCK_MERCHANTS.length} registered merchants</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-primary btn-sm"><Plus size={14} /> Onboard Merchant</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Active',    count: MOCK_MERCHANTS.filter(m => m.status === 'ACTIVE').length,    color: 'var(--success)', bg: 'var(--success-muted)' },
          { label: 'Pending',   count: MOCK_MERCHANTS.filter(m => m.status === 'PENDING').length,   color: 'var(--warning)', bg: 'var(--warning-muted)' },
          { label: 'Suspended', count: MOCK_MERCHANTS.filter(m => m.status === 'SUSPENDED').length, color: 'var(--danger)',  bg: 'var(--danger-muted)' },
          { label: 'KYC Verified', count: MOCK_MERCHANTS.filter(m => m.kycStatus === 'VERIFIED').length, color: 'var(--info)', bg: 'var(--info-muted)' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color }}>{count}</span>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search merchants..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'].map(s => (
            <button key={s} className={`chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ fontSize: 11 }}>
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Merchant grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {filtered.map(merchant => (
          <div key={merchant.id} className="card" style={{ padding: 20, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-elevated)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `hsl(${merchant.name.charCodeAt(0) * 7 % 360}, 60%, 20%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700,
                  color: `hsl(${merchant.name.charCodeAt(0) * 7 % 360}, 80%, 70%)`,
                  border: `1px solid hsl(${merchant.name.charCodeAt(0) * 7 % 360}, 40%, 30%)`,
                }}>
                  {merchant.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{merchant.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{merchant.id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <span className={`badge ${STATUS_BADGE[merchant.status]}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {STATUS_ICONS[merchant.status]} {merchant.status}
                </span>
                <span className={`badge ${KYC_BADGE[merchant.kycStatus]}`} style={{ fontSize: 10 }}>
                  KYC: {merchant.kycStatus}
                </span>
              </div>
            </div>

            {/* Business info */}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={11} /> {merchant.businessType}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} /> {merchant.email}</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>30d Volume</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{formatCurrency(merchant.volume30d)}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Success Rate</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: merchant.successRate >= 95 ? 'var(--success)' : merchant.successRate >= 90 ? 'var(--warning)' : 'var(--danger)' }}>
                  {merchant.successRate}%
                </div>
              </div>
            </div>

            {/* Gateways */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {merchant.assignedGateways.map(gw => (
                <span key={gw} className="chip" style={{ fontSize: 11, padding: '2px 8px', cursor: 'default' }}>{gw}</span>
              ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>Onboarded {formatDate(merchant.onboardedAt).split(',')[0]}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}>Details</button>
                <button className="btn btn-secondary btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}>Configure</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
