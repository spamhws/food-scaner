import { IconKeyboard, IconBolt } from '@tabler/icons-react';

interface ScannerControlProps {
  onKeyboardClick: () => void;
  onFlashClick: () => void;
  controlHeight: number;
}

export function ScannerControl({ onKeyboardClick, onFlashClick, controlHeight }: ScannerControlProps) {
  return (
    <div className={'flex items-center justify-center gap-1 overflow-hidden rounded-b-2xl w-full self-end'} style={{ height: `${controlHeight}px` }}>
      <button onClick={onKeyboardClick} className='h-full grow bg-gray-500/20 backdrop-blur-sm flex items-center justify-center'>
        <IconKeyboard size={24} stroke={2} className='text-white' />
      </button>
      <button onClick={onFlashClick} className='h-full grow  bg-gray-500/20 backdrop-blur-sm flex items-center justify-center'>
        <IconBolt size={24} stroke={2} className='text-white' />
      </button>
    </div>
  );
}
