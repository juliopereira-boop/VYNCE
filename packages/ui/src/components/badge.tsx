import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        brand: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
        emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
        amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
        slate: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
        rose: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
      },
    },
    defaultVariants: {
      tone: 'slate',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
