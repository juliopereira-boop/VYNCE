import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AgencyForm } from '@/components/agency-form';
import { PageHeader } from '@/components/page-header';
import { getAgencyById } from '@/server/agencies';
import { toAgencyDTO } from '@/lib/dto';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const agency = await getAgencyById(id);
  return { title: agency ? `Editar ${agency.tradeName}` : 'Editar' };
}

export default async function EditAgencyPage({ params }: { params: Params }) {
  const { id } = await params;
  const record = await getAgencyById(id);
  if (!record) notFound();

  const agency = toAgencyDTO(record);

  return (
    <>
      <Link
        href={`/imobiliarias/${agency.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para os detalhes
      </Link>
      <PageHeader
        title={`Editar ${agency.tradeName}`}
        description="Atualize os dados da entidade e do gerente responsável."
      />
      <AgencyForm mode="edit" initial={agency} />
    </>
  );
}
