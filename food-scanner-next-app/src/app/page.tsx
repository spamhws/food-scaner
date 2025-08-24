'use client';

import { BarcodeScanner } from '@/components/BarcodeScanner';

export default function Home() {
  return (
    <main className='w-screen h-[100dvh] relative overflow-hidden'>
      <BarcodeScanner />
    </main>
  );
}
