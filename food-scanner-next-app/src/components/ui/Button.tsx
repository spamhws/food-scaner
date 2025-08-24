import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', ...props }, ref) => {
  return <button ref={ref} className={cn('px-6 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed', variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600', variant === 'secondary' && 'bg-gray-10 text-gray-90 hover:bg-gray-20 focus:ring-gray-60 border border-gray-30', className)} {...props} />;
});

Button.displayName = 'Button';
