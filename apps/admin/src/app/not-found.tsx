import { Compass } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@vynce/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="bg-brand-50 text-brand-600 flex h-14 w-14 items-center justify-center rounded-2xl">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Página não encontrada</h1>
      <p className="mt-1 text-sm text-slate-500">
        O recurso que você procura não existe ou foi removido.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button>Voltar ao dashboard</Button>
      </Link>
    </div>
  );
}
