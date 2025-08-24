import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { BarcodeScanner } from '@/components/BarcodeScanner';

interface BarcodeSearchProps {
  onSearch: (barcode: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

const EXAMPLE_BARCODES = ['04963406', '3017620422003', '068200479064', '040000001457', '070847023391'];

export function BarcodeSearch({ onSearch, isLoading, error, className }: BarcodeSearchProps) {
  const [barcode, setBarcode] = useState('3017620422003');
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onSearch(barcode.trim());
    }
  };

  const handleExampleClick = (exampleBarcode: string) => {
    setBarcode(exampleBarcode);
    onSearch(exampleBarcode);
  };

  const handleBarcodeDetected = (detectedBarcode: string) => {
    setBarcode(detectedBarcode);
    onSearch(detectedBarcode);
    setShowScanner(false);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className='mb-2'>
        <div className='flex gap-4'>
          <input type='text' value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder='Enter barcode number' className={cn('flex-1 px-4 py-2 rounded-xl border', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent', error ? 'border-red-60 focus-visible:ring-red-60' : 'border-gray-30 focus-visible:ring-blue-60')} />
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      <div className='flex flex-wrap gap-2 mb-4 items-center'>
        <Button variant='secondary' onClick={() => setShowScanner(!showScanner)} className='w-full mb-4'>
          {showScanner ? 'Hide Scanner' : 'Scan Barcode'}
        </Button>
        Examples:
        {EXAMPLE_BARCODES.map((barcode) => (
          <button key={barcode} onClick={() => handleExampleClick(barcode)} className={cn('px-3 py-1.5 text-sm rounded-lg border-gray-60 border', 'bg-gray-10 hover:bg-gray-20 transition-colors', 'focus:outline-none focus:ring-2 focus:ring-blue-600')}>
            {barcode}
          </button>
        ))}
      </div>

      {showScanner && <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} />}

      {error && <div className={cn('bg-red-10 text-red-60 p-4 rounded-xl mt-4')}>{error.message}</div>}
    </div>
  );
}
