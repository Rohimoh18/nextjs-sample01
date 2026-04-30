'use client';
import { useState } from 'react';
import { Key, Webhook, Bell, Shield, Eye, EyeOff, Copy, RefreshCw, Plus, CheckCircle2, Smartphone, Palette, Check } from 'lucide-react';
import { useTheme, THEMES, ThemeId } from '@/lib/theme';

const API_KEYS = [
  { id: 'key_live_1', name: 'Production Key', key: 'jp_live_sk_xxxxxxxxxxxxxxxxxxx4a8f', env: 'LIVE', createdAt: '2024-01-15', lastUsed: '2 hours ago' },
  { id: 'key_test_1', name: 'Test Key', key: 'jp_test_sk_xxxxxxxxxxxxxxxxxxx9c2e', env: 'TEST', createdAt: '2024-01-15', lastUsed: '5 days ago' },
];

const WEBHOOKS = [
  { id: 'wh_1', url: 'https://api.flipkart.com/webhooks/MyPay', events: ['payment.success', 'payment.failed', 'refund.processed'], active: true },
  { id: 'wh_2', url: 'https://api.zomato.com/pay/callbacks', events: ['payment.success', 'dispute.created'], active: true },
  { id: 'wh_3', url: 'https://hooks.swiggy.in/payments', events: ['refund.processed'], active: false },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [twoFA, setTwoFA] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [webhookAlerts, setWebhookAlerts] = useState(true);
  const [activeTab, setActiveTab] = useState('api-keys');
  const [webhooks, setWebhooks] = useState(WEBHOOKS);

  const toggleKey = (id: string) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const TABS = [
    { id: 'api-keys',     label: 'API Keys',      icon: Key },
    { id: 'webhooks',     label: 'Webhooks',       icon: Webhook },
    { id: 'notifications',label: 'Notifications',  icon: Bell },
    { id: 'security',     label: 'Security',       icon: Shield },
    { id: 'appearance',   label: 'Appearance',     icon: Palette },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
          Manage API keys, webhooks, notifications, and security preferences
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 0 }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: activeTab === id ? 600 : 400,
              color: activeTab === id ? 'var(--accent-primary-hover)' : 'var(--text-secondary)',
              borderBottom: activeTab === id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* API Keys */}
      {activeTab === 'api-keys' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>API Keys</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Keep your secret keys private. Never share them publicly.</div>
            </div>
            <button className="btn btn-primary btn-sm"><Plus size={14} /> Generate Key</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {API_KEYS.map(k => (
              <div key={k.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: k.env === 'LIVE' ? 'var(--success-muted)' : 'var(--warning-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Key size={18} style={{ color: k.env === 'LIVE' ? 'var(--success)' : 'var(--warning)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{k.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Created {k.createdAt} · Last used {k.lastUsed}</div>
                    </div>
                  </div>
                  <span className={k.env === 'LIVE' ? 'badge badge-success' : 'badge badge-warning'}>{k.env}</span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-primary)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border-subtle)', marginBottom: 14 }}>
                  <code style={{ flex: 1, fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                    {showKeys[k.id] ? k.key : k.key.replace(/[^.]/g, '•').slice(0, 36)}
                  </code>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} onClick={() => toggleKey(k.id)}>
                    {showKeys[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
                    <Copy size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RefreshCw size={12} /> Regenerate
                  </button>
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 12 }}>Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhooks */}
      {activeTab === 'webhooks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Webhook Endpoints</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Receive real-time event notifications</div>
            </div>
            <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Endpoint</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {webhooks.map(wh => (
              <div key={wh.id} className="card" style={{ padding: 18, opacity: wh.active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <code style={{ fontSize: 13, color: 'var(--accent-primary-hover)', fontFamily: 'monospace' }}>{wh.url}</code>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={wh.active ? 'badge badge-success' : 'badge badge-muted'}>{wh.active ? 'Active' : 'Inactive'}</span>
                    <label className="switch">
                      <input type="checkbox" checked={wh.active} onChange={() => setWebhooks(prev => prev.map(w => w.id === wh.id ? { ...w, active: !w.active } : w))} />
                      <span className="switch-slider" />
                    </label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {wh.events.map(ev => (
                    <span key={ev} className="badge badge-primary" style={{ fontSize: 10, fontFamily: 'monospace' }}>{ev}</span>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>Test Endpoint</button>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>Edit</button>
                  <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ padding: 24, maxWidth: 560 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Notification Preferences</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Choose how you receive alerts</div>
          {[
            { label: 'Email Notifications', desc: 'Receive alerts via email', value: emailNotifs, set: setEmailNotifs, icon: Bell },
            { label: 'SMS Alerts', desc: 'Get critical alerts via SMS', value: smsNotifs, set: setSmsNotifs, icon: Smartphone },
            { label: 'Webhook Failure Alerts', desc: 'Alert when webhook delivery fails', value: webhookAlerts, set: setWebhookAlerts, icon: Webhook },
          ].map(({ label, desc, value, set, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={value} onChange={() => set(!value)} />
                <span className="switch-slider" />
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div style={{ maxWidth: 560 }}>
          <div className="card" style={{ padding: 24, marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Security Settings</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Two-Factor Authentication
                  {twoFA && <span className="badge badge-success" style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle2 size={10} /> Enabled</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Require 2FA for all admin logins</div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
                <span className="switch-slider" />
              </label>
            </div>
            <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Change Password</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="input" type="password" placeholder="Current password" />
                <input className="input" type="password" placeholder="New password" />
                <input className="input" type="password" placeholder="Confirm new password" />
                <button className="btn btn-primary btn-sm" style={{ width: 'fit-content' }}>Update Password</button>
              </div>
            </div>
            <div style={{ paddingTop: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Session Management</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Manage active sessions across devices</div>
              <button className="btn btn-danger btn-sm">Terminate All Sessions</button>
            </div>
          </div>

          <div className="card" style={{ padding: 20, borderLeft: '3px solid var(--danger)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger)', marginBottom: 6 }}>Danger Zone</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>These actions are irreversible. Proceed with caution.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger btn-sm">Export All Data</button>
              <button className="btn btn-danger btn-sm">Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Appearance ── */}
      {activeTab === 'appearance' && (
        <div style={{ maxWidth: 680 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Theme</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Choose a colour scheme for the console. Your preference is saved automatically.
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 14,
            }}>
              {THEMES.map(t => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      borderRadius: 14,
                      border: active
                        ? `2px solid var(--accent-primary)`
                        : '2px solid var(--border-default)',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxShadow: active ? '0 0 0 3px var(--accent-primary-muted)' : 'none',
                      position: 'relative',
                    }}>
                      {/* Mini UI preview */}
                      <div style={{ height: 80, background: t.preview.bg, display: 'flex', gap: 0 }}>
                        {/* Sidebar strip */}
                        <div style={{ width: 28, background: t.preview.sidebar, borderRight: `1px solid rgba(255,255,255,0.06)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 5 }}>
                          {[1,2,3,4].map(n => (
                            <div key={n} style={{ width: 14, height: 3, borderRadius: 2, background: n === 1 ? t.preview.accent : 'rgba(255,255,255,0.12)' }} />
                          ))}
                        </div>
                        {/* Content area */}
                        <div style={{ flex: 1, padding: '8px 8px 6px' }}>
                          {/* Header bar */}
                          <div style={{ height: 10, background: t.preview.sidebar, borderRadius: 4, marginBottom: 6, border: `1px solid rgba(255,255,255,0.05)` }} />
                          {/* Cards */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                            {[1,2,3,4].map(n => (
                              <div key={n} style={{ height: 18, borderRadius: 4, background: t.preview.sidebar, border: `1px solid rgba(255,255,255,0.05)` }}>
                                <div style={{ width: `${30 + n * 10}%`, height: 3, borderRadius: 2, background: t.preview.accent, margin: '4px 4px 0' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Label row */}
                      <div style={{
                        padding: '10px 12px',
                        background: 'var(--bg-surface)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{t.description}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: active ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                          border: active ? 'none' : '1px solid var(--border-default)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'background 0.2s',
                        }}>
                          {active && <Check size={11} color="white" strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Accent colour strip */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Current accent</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 12px var(--accent-primary)',
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {THEMES.find(t => t.id === theme)?.label} theme
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {THEMES.find(t => t.id === theme)?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
