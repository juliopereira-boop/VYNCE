'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@vynce/ui';

export function DeleteAgencyButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/agencies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/imobiliarias');
        router.refresh();
      } else {
        setDeleting(false);
        setConfirming(false);
      }
    } catch {
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-slate-500 sm:inline">Excluir “{name}”?</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={deleting}
        >
          Cancelar
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete} isLoading={deleting}>
          Confirmar exclusão
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
      <Trash2 className="h-4 w-4" />
      Excluir
    </Button>
  );
}
