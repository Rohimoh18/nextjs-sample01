import type { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'MyPay Admin Console',
  description: 'Payment orchestration admin panel — manage transactions, merchants, gateways, refunds and disputes.',
  keywords: ['payment', 'admin', 'MyPay', 'dashboard', 'fintech'],
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header />
          <main style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--bg-primary)',
            padding: '28px 28px 40px',
          }}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

