'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[88px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
          'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2',
          'disabled:cursor-not-allowed disabled:bg-slate-50',
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
Textarea.displayName = 'Textarea';
