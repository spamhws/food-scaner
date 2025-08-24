import { IconSettings, IconHistory, IconHeart } from '@tabler/icons-react';

export function Navigation() {
  return (
    <nav className='w-full h-16 flex items-center justify-center gap-1  rounded-2xl overflow-hidden'>
      <a href='#' className='flex-1 h-full flex items-center justify-center bg-gray-500/20 backdrop-blur-sm'>
        <IconSettings size={24} stroke={2} className='text-white' />
      </a>
      <a href='#' className='flex-1 h-full flex items-center justify-center bg-gray-500/20 backdrop-blur-sm'>
        <IconHistory size={24} stroke={2} className='text-white' />
      </a>
      <a href='#' className='flex-1 h-full flex items-center justify-center bg-gray-500/20 backdrop-blur-sm'>
        <IconHeart size={24} stroke={2} className='text-white' />
      </a>
    </nav>
  );
}
