import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('text-brand-600 h-5 w-5 animate-spin', className)} />;
}
