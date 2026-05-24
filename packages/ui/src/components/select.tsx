'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2',
            'disabled:cursor-not-allowed disabled:bg-slate-50',
            invalid
              ? 'border-rose-400 focus-visible:ring-rose-300'
              : 'focus-visible:border-brand-500 focus-visible:ring-brand-200 border-slate-300',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    );
  },
);
Select.displayName = 'Select';
