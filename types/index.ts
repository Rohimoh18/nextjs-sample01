export interface Transaction {
  id: string;
  orderId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED' | 'PARTIAL_REFUND';
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'EMI' | 'BNPL';
  gateway: string;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  customerPhone: string;
  bankCode?: string;
  errorCode?: string;
  errorMessage?: string;
  gatewayRefId?: string;
  ipAddress?: string;
  upiId?: string;
  cardLast4?: string;
  cardNetwork?: string;
}

export interface Merchant {
  id: string;
  name: string;
  businessType: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  onboardedAt: string;
  volume30d: number;
  successRate: number;
  assignedGateways: string[];
  websiteUrl: string;
  country: string;
}

export interface Gateway {
  id: string;
  name: string;
  logo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEGRADED';
  successRate: number;
  avgLatencyMs: number;
  uptime: number;
  priority: number;
  supportedMethods: string[];
  volume24h: number;
  failureRate: number;
  lastIncident?: string;
}

export interface Refund {
  id: string;
  transactionId: string;
  merchantName: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'FAILED';
  requestedAt: string;
  processedAt?: string;
  requestedBy: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  merchantName: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'WON' | 'LOST' | 'WITHDRAWN';
  dueDate: string;
  openedAt: string;
  disputeType: 'CHARGEBACK' | 'FRAUD' | 'ITEM_NOT_RECEIVED' | 'UNAUTHORIZED';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'DEVELOPER' | 'SUPPORT';
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  createdAt: string;
  avatar: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface KPIData {
  totalRevenue: number;
  revenueChange: number;
  totalTransactions: number;
  transactionsChange: number;
  successRate: number;
  successRateChange: number;
  activeMerchants: number;
  merchantsChange: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  transactions: number;
  success: number;
  failed: number;
}
