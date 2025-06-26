import './globals.css';
import { ReactNode } from 'react';
import SessionWrapper from '@/components/SessionWrapper'; // ✅ updated

export const metadata = {
  title: 'VendorVault',
  description: 'Vendor management made easy',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper> {/* ✅ wrap with client-side provider */}
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
