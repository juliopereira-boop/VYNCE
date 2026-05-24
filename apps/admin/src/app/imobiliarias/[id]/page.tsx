import { ArrowLeft, Globe, Mail, MapPin, Pencil, Phone, UserCog } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Button, Card, CardBody, CardHeader } from '@vynce/ui';
import { USER_ROLE_LABELS, type UserRoleValue } from '@vynce/validation';
import { EntityTypeBadge, StatusBadge } from '@/components/entity-type-badge';
import { DeleteAgencyButton } from '@/components/delete-agency-button';
import { getAgencyById } from '@/server/agencies';
import { toAgencyDTO } from '@/lib/dto';
import {
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatDateTime,
  formatPhone,
  initials,
} from '@/lib/format';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const agency = await getAgencyById(id);
  return { title: agency?.tradeName ?? 'Detalhes' };
}

function DataRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">
        {value || <span className="text-slate-400">—</span>}
      </dd>
    </div>
  );
}

export default async function AgencyDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const record = await getAgencyById(id);
  if (!record) notFound();

  const agency = toAgencyDTO(record);
  const manager = agency.manager;

  return (
    <>
      <Link
        href="/imobiliarias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a listagem
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="from-brand-500 to-brand-700 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold text-white">
            {initials(agency.tradeName)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {agency.tradeName}
              </h1>
              <EntityTypeBadge type={agency.type} />
              <StatusBadge status={agency.status} />
            </div>
            <p className="mt-0.5 text-sm text-slate-500">{agency.legalName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAgencyButton id={agency.id} name={agency.tradeName} />
          <Link href={`/imobiliarias/${agency.id}/editar`}>
            <Button>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Identificação" />
            <CardBody>
              <dl className="grid gap-x-8 sm:grid-cols-2">
                <DataRow label="Nome Fantasia" value={agency.tradeName} />
                <DataRow label="Razão Social" value={agency.legalName} />
                <DataRow label="CNPJ" value={formatCNPJ(agency.cnpj)} />
                <DataRow label="Inscrição Estadual" value={agency.stateRegistration} />
                <DataRow label="CRECI Jurídico" value={agency.creciJuridico} />
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Endereço" />
            <CardBody>
              <div className="mb-3 flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="text-brand-500 mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {agency.street}, {agency.number}
                  {agency.complement ? ` — ${agency.complement}` : ''} · {agency.district} ·{' '}
                  {agency.city}/{agency.state} · CEP {formatCEP(agency.zipCode)}
                </span>
              </div>
              <dl className="grid gap-x-8 sm:grid-cols-3">
                <DataRow label="CEP" value={formatCEP(agency.zipCode)} />
                <DataRow label="Cidade" value={agency.city} />
                <DataRow label="Estado" value={agency.state} />
              </dl>
            </CardBody>
          </Card>

          {agency.description && (
            <Card>
              <CardHeader title="Descrição" />
              <CardBody>
                <p className="text-sm leading-relaxed text-slate-700">{agency.description}</p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Contato" />
            <CardBody className="space-y-3 text-sm">
              <a
                href={`tel:${agency.phone}`}
                className="hover:text-brand-700 flex items-center gap-2 text-slate-700"
              >
                <Phone className="h-4 w-4 text-slate-400" />
                {formatPhone(agency.phone)}
              </a>
              <a
                href={`mailto:${agency.email}`}
                className="hover:text-brand-700 flex items-center gap-2 break-all text-slate-700"
              >
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                {agency.email}
              </a>
              {agency.website && (
                <a
                  href={agency.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-700 flex items-center gap-2 break-all text-slate-700"
                >
                  <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                  {agency.website}
                </a>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Gerente / Responsável" />
            <CardBody>
              {manager ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-50 text-brand-700 flex h-10 w-10 items-center justify-center rounded-full">
                      <UserCog className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{manager.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {USER_ROLE_LABELS[manager.role as UserRoleValue] ?? manager.role}
                      </p>
                    </div>
                  </div>
                  <dl className="grid gap-x-6 border-t border-slate-100 pt-3 sm:grid-cols-2">
                    <DataRow label="CPF" value={formatCPF(manager.cpf)} />
                    <DataRow label="CRECI" value={manager.creci} />
                    <DataRow label="E-mail (login)" value={manager.email} />
                    <DataRow label="Telefone" value={formatPhone(manager.phone)} />
                  </dl>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Nenhum gerente cadastrado.</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-xs text-slate-400">
              <p>Criado em {formatDateTime(agency.createdAt)}</p>
              <p>Atualizado em {formatDateTime(agency.updatedAt)}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
