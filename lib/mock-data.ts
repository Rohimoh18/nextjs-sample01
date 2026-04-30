import {
  Transaction, Merchant, Gateway, Refund,
  Dispute, AdminUser, AuditLog, KPIData, ChartDataPoint
} from '@/types';

// ──────────────── Deterministic seeded RNG (LCG) ────────────────
// Using a seeded pseudo-random generator so that server and client
// always produce identical values, preventing React hydration mismatches.
function makePrng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// One stable global seed — all derived sequences are deterministic.
const _prng = makePrng(42);

const rand = (min: number, max: number) => Math.floor(_prng() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(_prng() * arr.length)];

const GATEWAYS = ['Razorpay', 'PayU', 'Cashfree', 'Paytm', 'Stripe', 'CCAvenue'];
const METHODS: Transaction['paymentMethod'][] = ['UPI', 'CARD', 'NET_BANKING', 'WALLET', 'EMI', 'BNPL'];
const STATUSES: Transaction['status'][] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'];
const MERCHANTS_NAMES = [
  'FlipKart', 'Zomato', 'Swiggy', 'IRCTC', 'BigBasket', 'Myntra',
  'MakeMyTrip', 'BookMyShow', 'Ola Mobility', 'Dunzo', 'NoBroker', 'PharmEasy'
];

// Deterministic date: offsets from a fixed base timestamp instead of `new Date()`
const BASE_TS = new Date('2026-04-27T00:00:00Z').getTime();
function deterministicDate(daysBack: number): string {
  const offsetDays = rand(0, daysBack);
  const offsetHours = rand(0, 23);
  const offsetMins = rand(0, 59);
  const offsetSecs = rand(0, 59);
  const ts = BASE_TS
    - offsetDays * 86_400_000
    - offsetHours * 3_600_000
    - offsetMins * 60_000
    - offsetSecs * 1_000;
  return new Date(ts).toISOString();
}

// ──────────────── Transactions ────────────────
export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 120 }, (_, i) => {
  const status = pick(STATUSES);
  const method = pick(METHODS);
  return {
    id: `TXN${String(100000 + i).padStart(6, '0')}`,
    orderId: `ORD${String(200000 + i).padStart(6, '0')}`,
    merchantId: `MID${String(10 + (i % 12)).padStart(4, '0')}`,
    merchantName: MERCHANTS_NAMES[i % MERCHANTS_NAMES.length],
    amount: rand(50, 95000),
    currency: i % 5 === 0 ? pick(['USD', 'EUR']) : 'INR',
    status,
    paymentMethod: method,
    gateway: pick(GATEWAYS),
    createdAt: deterministicDate(30),
    updatedAt: deterministicDate(30),
    customerEmail: `user${i + 1}@example.com`,
    customerPhone: `+91${rand(7000000000, 9999999999)}`,
    gatewayRefId: `GW${String(rand(100000, 999999))}`,
    ipAddress: `${rand(100, 200)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`,
    ...(method === 'UPI' && { upiId: `user${i}@oksbi` }),
    ...(method === 'CARD' && {
      cardLast4: String(rand(1000, 9999)),
      cardNetwork: pick(['Visa', 'Mastercard', 'RuPay', 'Amex'])
    }),
    ...(status === 'FAILED' && {
      errorCode: pick(['PAYMENT_DECLINED', 'TIMEOUT', 'INVALID_OTP', 'BANK_ERROR']),
      errorMessage: pick(['Payment declined by bank', 'Transaction timed out', 'Invalid OTP entered'])
    }),
  };
});

// ──────────────── Merchants ────────────────
export const MOCK_MERCHANTS: Merchant[] = MERCHANTS_NAMES.map((name, i) => ({
  id: `MID${String(10 + i).padStart(4, '0')}`,
  name,
  businessType: pick(['E-Commerce', 'Food & Beverage', 'Travel', 'Healthcare', 'Entertainment', 'Logistics']),
  email: `admin@${name.toLowerCase().replace(/\s/g, '')}.com`,
  phone: `+91${rand(7000000000, 9999999999)}`,
  status: (pick(['ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED']) as Merchant['status']),
  kycStatus: (pick(['VERIFIED', 'VERIFIED', 'PENDING', 'REJECTED']) as Merchant['kycStatus']),
  onboardedAt: deterministicDate(365),
  volume30d: rand(100000, 50000000),
  successRate: parseFloat((rand(87, 99) + _prng()).toFixed(1)),
  assignedGateways: [pick(GATEWAYS), pick(GATEWAYS)].filter((v, i, a) => a.indexOf(v) === i),
  websiteUrl: `https://www.${name.toLowerCase().replace(/\s/g, '')}.com`,
  country: 'India',
}));

// ──────────────── Gateways ────────────────
export const MOCK_GATEWAYS: Gateway[] = [
  { id: 'GW001', name: 'Razorpay', logo: '💳', status: 'ACTIVE', successRate: 96.8, avgLatencyMs: 420, uptime: 99.9, priority: 1, supportedMethods: ['UPI', 'CARD', 'NET_BANKING', 'WALLET'], volume24h: 8500000, failureRate: 3.2 },
  { id: 'GW002', name: 'PayU', logo: '💰', status: 'ACTIVE', successRate: 94.2, avgLatencyMs: 580, uptime: 99.5, priority: 2, supportedMethods: ['UPI', 'CARD', 'NET_BANKING', 'WALLET', 'EMI'], volume24h: 5200000, failureRate: 5.8 },
  { id: 'GW003', name: 'Cashfree', logo: '🏦', status: 'ACTIVE', successRate: 95.5, avgLatencyMs: 390, uptime: 99.7, priority: 3, supportedMethods: ['UPI', 'CARD', 'NET_BANKING'], volume24h: 4100000, failureRate: 4.5 },
  { id: 'GW004', name: 'Paytm', logo: '🟦', status: 'DEGRADED', successRate: 89.1, avgLatencyMs: 920, uptime: 97.2, priority: 4, supportedMethods: ['UPI', 'WALLET', 'CARD'], volume24h: 3200000, failureRate: 10.9, lastIncident: '2 hours ago' },
  { id: 'GW005', name: 'Stripe', logo: '⚡', status: 'ACTIVE', successRate: 97.4, avgLatencyMs: 340, uptime: 99.95, priority: 5, supportedMethods: ['CARD', 'NET_BANKING', 'BNPL'], volume24h: 2100000, failureRate: 2.6 },
  { id: 'GW006', name: 'CCAvenue', logo: '🔵', status: 'INACTIVE', successRate: 88.0, avgLatencyMs: 1100, uptime: 96.0, priority: 6, supportedMethods: ['CARD', 'NET_BANKING', 'EMI'], volume24h: 0, failureRate: 12.0 },
];

// ──────────────── Refunds ────────────────
const REFUND_REASONS = ['Customer request', 'Duplicate payment', 'Order cancelled', 'Product not delivered', 'Wrong amount charged'];
export const MOCK_REFUNDS: Refund[] = Array.from({ length: 40 }, (_, i) => {
  const status = pick(['PENDING', 'APPROVED', 'PROCESSED', 'REJECTED', 'FAILED'] as Refund['status'][]);
  return {
    id: `REF${String(1000 + i).padStart(5, '0')}`,
    transactionId: `TXN${String(100000 + rand(0, 119)).padStart(6, '0')}`,
    merchantName: pick(MERCHANTS_NAMES),
    amount: rand(50, 25000),
    currency: 'INR',
    reason: pick(REFUND_REASONS),
    status,
    requestedAt: deterministicDate(15),
    processedAt: status === 'PROCESSED' ? deterministicDate(10) : undefined,
    requestedBy: `ops@MyPay.in`,
  };
});

// ──────────────── Disputes ────────────────
const DISPUTE_REASONS = ['Item not received', 'Unauthorized transaction', 'Duplicate charge', 'Product mismatch'];
export const MOCK_DISPUTES: Dispute[] = Array.from({ length: 25 }, (_, i) => ({
  id: `DIS${String(5000 + i).padStart(5, '0')}`,
  transactionId: `TXN${String(100000 + rand(0, 119)).padStart(6, '0')}`,
  merchantName: pick(MERCHANTS_NAMES),
  amount: rand(500, 50000),
  currency: 'INR',
  reason: pick(DISPUTE_REASONS),
  status: (pick(['OPEN', 'OPEN', 'UNDER_REVIEW', 'WON', 'LOST']) as Dispute['status']),
  dueDate: new Date(BASE_TS + rand(1, 14) * 86400000).toISOString(),
  openedAt: deterministicDate(20),
  disputeType: (pick(['CHARGEBACK', 'FRAUD', 'ITEM_NOT_RECEIVED', 'UNAUTHORIZED']) as Dispute['disputeType']),
}));

// ──────────────── Admin Users ────────────────
export const MOCK_USERS: AdminUser[] = [
  { id: 'U001', name: 'Rohini Mandaokar', email: 'rohini.mandadokar@MyPay.in', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: deterministicDate(1), createdAt: deterministicDate(365), avatar: 'AS' },
  { id: 'U002', name: 'Priya Nair', email: 'priya.nair@MyPay.in', role: 'OPERATIONS', status: 'ACTIVE', lastLogin: deterministicDate(1), createdAt: deterministicDate(300), avatar: 'PN' },
  { id: 'U003', name: 'Rohit Verma', email: 'rohit.verma@MyPay.in', role: 'FINANCE', status: 'ACTIVE', lastLogin: deterministicDate(2), createdAt: deterministicDate(270), avatar: 'RV' },
  { id: 'U004', name: 'Sneha Reddy', email: 'sneha.reddy@MyPay.in', role: 'DEVELOPER', status: 'ACTIVE', lastLogin: deterministicDate(1), createdAt: deterministicDate(200), avatar: 'SR' },
  { id: 'U005', name: 'Karan Mehta', email: 'karan.mehta@MyPay.in', role: 'SUPPORT', status: 'ACTIVE', lastLogin: deterministicDate(3), createdAt: deterministicDate(180), avatar: 'KM' },
  { id: 'U006', name: 'Divya Krishnan', email: 'divya.k@MyPay.in', role: 'OPERATIONS', status: 'INACTIVE', lastLogin: deterministicDate(30), createdAt: deterministicDate(400), avatar: 'DK' },
  { id: 'U007', name: 'Aditya Gupta', email: 'aditya.g@MyPay.in', role: 'DEVELOPER', status: 'ACTIVE', lastLogin: deterministicDate(1), createdAt: deterministicDate(120), avatar: 'AG' },
  { id: 'U008', name: 'Meera Pillai', email: 'meera.p@MyPay.in', role: 'FINANCE', status: 'ACTIVE', lastLogin: deterministicDate(2), createdAt: deterministicDate(150), avatar: 'MP' },
];

// ──────────────── Audit Logs ────────────────
const ACTIONS = [
  { action: 'REFUND_APPROVED', resource: 'Refund', severity: 'INFO' },
  { action: 'GATEWAY_DISABLED', resource: 'Gateway', severity: 'WARNING' },
  { action: 'MERCHANT_SUSPENDED', resource: 'Merchant', severity: 'CRITICAL' },
  { action: 'API_KEY_REGENERATED', resource: 'Settings', severity: 'WARNING' },
  { action: 'USER_INVITED', resource: 'User', severity: 'INFO' },
  { action: 'DISPUTE_STATUS_CHANGED', resource: 'Dispute', severity: 'INFO' },
  { action: 'ROUTING_RULE_UPDATED', resource: 'Gateway', severity: 'WARNING' },
  { action: 'REFUND_REJECTED', resource: 'Refund', severity: 'INFO' },
  { action: 'MERCHANT_KYC_APPROVED', resource: 'Merchant', severity: 'INFO' },
  { action: 'LOGIN_SUCCESS', resource: 'Auth', severity: 'INFO' },
];
export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 60 }, (_, i) => {
  const entry = pick(ACTIONS);
  const user = pick(MOCK_USERS);
  return {
    id: `LOG${String(9000 + i).padStart(5, '0')}`,
    userId: user.id,
    userName: user.name,
    action: entry.action,
    resource: entry.resource,
    resourceId: `${entry.resource.toUpperCase().slice(0, 3)}${rand(1000, 9999)}`,
    details: `${entry.action.replace(/_/g, ' ').toLowerCase()} performed via admin panel`,
    ipAddress: `10.0.${rand(0, 5)}.${rand(1, 254)}`,
    timestamp: deterministicDate(30),
    severity: entry.severity as AuditLog['severity'],
  };
});

// ──────────────── KPI Data ────────────────
export const MOCK_KPI: KPIData = {
  totalRevenue: 284750000,
  revenueChange: 12.4,
  totalTransactions: 1248932,
  transactionsChange: 8.7,
  successRate: 94.6,
  successRateChange: 1.2,
  activeMerchants: 347,
  merchantsChange: 5.8,
};

// ──────────────── Revenue Chart Data ────────────────
export const MOCK_CHART_DATA: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(BASE_TS - (29 - i) * 86_400_000);
  const transactions = rand(32000, 58000);
  const success = Math.floor(transactions * (rand(91, 97) / 100));
  return {
    date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: rand(6000000, 14000000),
    transactions,
    success,
    failed: transactions - success,
  };
});

// ──────────────── Payment Method Distribution ────────────────
export const MOCK_PAYMENT_METHODS = [
  { name: 'UPI', value: 42, color: '#6366F1' },
  { name: 'Card', value: 28, color: '#10B981' },
  { name: 'Net Banking', value: 15, color: '#F59E0B' },
  { name: 'Wallet', value: 8, color: '#3B82F6' },
  { name: 'EMI', value: 5, color: '#EC4899' },
  { name: 'BNPL', value: 2, color: '#8B5CF6' },
];

// ──────────────── Utility ────────────────
export function formatCurrency(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString('en-IN');
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
