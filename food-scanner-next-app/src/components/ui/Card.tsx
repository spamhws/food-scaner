import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('bg-white rounded-2xl shadow-lg p-6 mb-6', className)} {...props} />;
});

Card.displayName = 'Card';
