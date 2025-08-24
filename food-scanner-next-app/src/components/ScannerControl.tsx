import { IconKeyboard, IconBolt } from '@tabler/icons-react';

interface ScannerControlProps {
  onKeyboardClick: () => void;
  onFlashClick: () => void;
}

export function ScannerControl({ onKeyboardClick, onFlashClick }: ScannerControlProps) {
  return (
    <div className={'absolute bottom-2 inset-x-2 flex items-center justify-center gap-1  h-16 overflow-hidden rounded-b-2xl'}>
      <button onClick={onKeyboardClick} className='h-full grow bg-gray-500/20 backdrop-blur-sm flex items-center justify-center'>
        <IconKeyboard size={24} stroke={2} className='text-white' />
      </button>
      <button onClick={onFlashClick} className='h-full grow  bg-gray-500/20 backdrop-blur-sm flex items-center justify-center'>
        <IconBolt size={24} stroke={2} className='text-white' />
      </button>
    </div>
  );
}
