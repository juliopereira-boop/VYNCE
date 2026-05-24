'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
          'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          invalid
            ? 'border-rose-400 focus-visible:ring-rose-300'
            : 'focus-visible:border-brand-500 focus-visible:ring-brand-200 border-slate-300',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
