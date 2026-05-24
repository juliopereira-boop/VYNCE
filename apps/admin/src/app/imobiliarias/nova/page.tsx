import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AgencyForm } from '@/components/agency-form';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = { title: 'Nova Imobiliária/House' };

export default function NewAgencyPage() {
  return (
    <>
      <Link
        href="/imobiliarias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a listagem
      </Link>
      <PageHeader
        title="Nova Imobiliária/House"
        description="Preencha os dados da entidade e do gerente responsável."
      />
      <AgencyForm mode="create" />
    </>
  );
}
