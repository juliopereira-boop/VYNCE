'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@vynce/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Algo deu errado</h1>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        Ocorreu um erro ao carregar esta página. Verifique a conexão com o banco de dados
        (variáveis <code className="rounded bg-slate-100 px-1">DATABASE_URL</code>/
        <code className="rounded bg-slate-100 px-1">DIRECT_URL</code>) e se as migrations foram
        aplicadas.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-slate-400">Digest: {error.digest}</p>
      )}
      <Button className="mt-6" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
