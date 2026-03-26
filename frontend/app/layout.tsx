import type { Metadata } from 'next';
import { MainNav } from '@/components/layout/main-nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sales Evaluation App',
  description: 'Technical assessment scaffold for sales evaluation.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <MainNav />
          <main className="app-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
