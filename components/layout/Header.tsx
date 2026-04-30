'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, ChevronDown, Settings, LogOut, User, HelpCircle, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, icon: AlertCircle, color: 'var(--warning)', text: 'Paytm gateway latency spiked to 920ms', time: '5m ago', unread: true },
  { id: 2, icon: CheckCircle2, color: 'var(--success)', text: 'Refund REF01023 processed successfully', time: '12m ago', unread: true },
  { id: 3, icon: AlertCircle, color: 'var(--danger)', text: 'New dispute DIS05018 opened by Zomato', time: '1h ago', unread: true },
  { id: 4, icon: Info, color: 'var(--info)', text: 'Monthly settlement report ready', time: '3h ago', unread: false },
];

export default function Header({ title }: { title?: string }) {
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0,
    }}>
      {/* Left: Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            placeholder="Search transactions, merchants, orders..."
            style={{ paddingLeft: 36, fontSize: 13, background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
          />
          <span style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: 10, color: 'var(--text-disabled)',
            background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4,
            border: '1px solid var(--border-subtle)',
          }}>⌘K</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            className="btn btn-ghost btn-sm"
            style={{ padding: '8px', borderRadius: 'var(--radius-md)', position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--danger)', fontSize: 10, fontWeight: 700,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-secondary)',
              }}>{unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setShowNotifs(false)} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: 340,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-elevated)',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'fadeInUp 0.2s ease',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  <span style={{ fontSize: 12, color: 'var(--accent-primary-hover)', cursor: 'pointer' }}>Mark all read</span>
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} style={{
                    display: 'flex', gap: 12, padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: n.unread ? 'rgba(99,102,241,0.04)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.unread ? 'rgba(99,102,241,0.04)' : 'transparent'}
                  >
                    <n.icon size={16} style={{ color: n.color, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                    </div>
                    {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0, marginTop: 6, marginLeft: 'auto' }} />}
                  </div>
                ))}
                <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--accent-primary-hover)', cursor: 'pointer' }}>View all notifications</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help */}
        <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
          <HelpCircle size={18} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '6px 8px', borderRadius: 'var(--radius-md)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white',
            }}>AS</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Rohini Mandaokar</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />
          </button>

          {showUser && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setShowUser(false)} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: 200,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-elevated)',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'fadeInUp 0.2s ease',
              }}>
                {[
                  { icon: User, label: 'My Profile' },
                  { icon: Settings, label: 'Settings' },
                  { icon: HelpCircle, label: 'Help & Support' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', cursor: 'pointer',
                    fontSize: 13, color: 'var(--text-secondary)',
                    transition: 'all 0.15s',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                  >
                    <Icon size={14} /> {label}
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', cursor: 'pointer',
                    fontSize: 13, color: 'var(--danger)',
                    transition: 'all 0.15s',
                  }}
                  onClick={() => { setShowUser(false); router.push('/login'); }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                >
                  <LogOut size={14} /> Sign Out
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
