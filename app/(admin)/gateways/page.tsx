'use client';
import { useState } from 'react';
import { Activity, Zap, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, XCircle, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { MOCK_GATEWAYS, formatNumber, formatCurrency } from '@/lib/mock-data';
import { Gateway } from '@/types';

const STATUS_CONF: Record<Gateway['status'], { badge: string; dot: string; label: string }> = {
  ACTIVE:   { badge: 'badge-success', dot: 'glow-dot-green',  label: 'Active' },
  DEGRADED: { badge: 'badge-warning', dot: 'glow-dot-amber',  label: 'Degraded' },
  INACTIVE: { badge: 'badge-muted',   dot: 'glow-dot-red',    label: 'Inactive' },
};

export default function GatewaysPage() {
  const [gateways, setGateways] = useState(MOCK_GATEWAYS);

  const toggleGateway = (id: string) => {
    setGateways(prev => prev.map(gw => {
      if (gw.id !== id) return gw;
      return { ...gw, status: gw.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE' };
    }));
  };

  const totalVolume = gateways.filter(g => g.status !== 'INACTIVE').reduce((acc, g) => acc + g.volume24h, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Payment Gateways</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Routing priority and performance overview
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Zap size={14} /> Configure Routing</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Active Gateways', value: gateways.filter(g => g.status === 'ACTIVE').length, icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-muted)' },
          { label: 'Degraded', value: gateways.filter(g => g.status === 'DEGRADED').length, icon: AlertTriangle, color: 'var(--warning)', bg: 'var(--warning-muted)' },
          { label: 'Offline', value: gateways.filter(g => g.status === 'INACTIVE').length, icon: XCircle, color: 'var(--danger)', bg: 'var(--danger-muted)' },
          { label: '24h Volume', value: formatCurrency(totalVolume), icon: Activity, color: 'var(--accent-primary)', bg: 'var(--accent-primary-muted)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gateway List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {gateways.map((gw, idx) => {
          const sc = STATUS_CONF[gw.status];
          const isActive = gw.status !== 'INACTIVE';
          return (
            <div key={gw.id} className="card" style={{ padding: 20, opacity: isActive ? 1 : 0.6, transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Priority drag handle */}
                <div style={{ color: 'var(--text-disabled)', cursor: 'grab', flexShrink: 0 }}>
                  <GripVertical size={16} />
                </div>

                {/* Priority badge */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: isActive ? 'var(--accent-primary-muted)' : 'var(--bg-surface)',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.3)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: isActive ? 'var(--accent-primary-hover)' : 'var(--text-disabled)',
                }}>
                  {idx + 1}
                </div>

                {/* Logo + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                  <span style={{ fontSize: 24 }}>{gw.logo}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{gw.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <div className={`glow-dot ${sc.dot}`} />
                      <span className={`badge ${sc.badge}`} style={{ fontSize: 10, padding: '1px 6px' }}>{sc.label}</span>
                      {gw.lastIncident && <span style={{ fontSize: 10, color: 'var(--warning)' }}>Incident {gw.lastIncident}</span>}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: 32, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <MetricItem icon={<TrendingUp size={14} />} label="Success Rate" value={`${gw.successRate}%`} color={gw.successRate >= 95 ? 'var(--success)' : gw.successRate >= 90 ? 'var(--warning)' : 'var(--danger)'} />
                  <MetricItem icon={<Clock size={14} />} label="Avg Latency" value={`${gw.avgLatencyMs}ms`} color={gw.avgLatencyMs < 500 ? 'var(--success)' : gw.avgLatencyMs < 800 ? 'var(--warning)' : 'var(--danger)'} />
                  <MetricItem icon={<Activity size={14} />} label="Uptime" value={`${gw.uptime}%`} color="var(--text-primary)" />
                  <MetricItem icon={<Zap size={14} />} label="24h Volume" value={formatCurrency(gw.volume24h)} color="var(--text-primary)" />
                </div>

                {/* Supported methods */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: 200 }}>
                  {gw.supportedMethods.map(m => (
                    <span key={m} className="badge badge-muted" style={{ fontSize: 10, padding: '1px 6px' }}>{m}</span>
                  ))}
                </div>

                {/* Toggle */}
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  <button
                    className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-secondary'}`}
                    onClick={() => toggleGateway(gw.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                  >
                    {isActive ? <ToggleRight size={16} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={16} style={{ color: 'var(--text-muted)' }} />}
                    {isActive ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Success rate bar */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Success rate (last 24h)</span>
                  <span>{gw.successRate}% success · {gw.failureRate}% failure</span>
                </div>
                <div className="progress-bar" style={{ height: 5 }}>
                  <div className="progress-fill" style={{ width: `${gw.successRate}%`, background: gw.successRate >= 95 ? 'linear-gradient(90deg, #10B981, #34D399)' : gw.successRate >= 90 ? 'linear-gradient(90deg, #F59E0B, #FCD34D)' : 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricItem({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', justifyContent: 'center', marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 11 }}>{label}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
