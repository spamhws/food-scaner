import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Food Scanner',
  description: 'Scan food products to get detailed nutritional information',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={montserrat.className}>
      <body className='min-h-screen bg-gray-50' suppressHydrationWarning={true}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
