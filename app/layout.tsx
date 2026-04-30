import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyPay Admin Console',
  description: 'Payment orchestration admin panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
