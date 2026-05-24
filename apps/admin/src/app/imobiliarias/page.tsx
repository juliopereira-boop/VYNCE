import { Building2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button, Card, Input, cn } from '@vynce/ui';
import { type EntityTypeValue } from '@vynce/validation';
import { PageHeader } from '@/components/page-header';
import { EntityTypeBadge, StatusBadge } from '@/components/entity-type-badge';
import { listAgencies } from '@/server/agencies';
import { formatCNPJ, formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Imobiliárias & Houses' };
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ search?: string; type?: string; page?: string }>;

const FILTERS: { label: string; value: 'ALL' | EntityTypeValue }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Imobiliárias', value: 'IMOBILIARIA' },
  { label: 'Houses', value: 'HOUSE' },
];

function buildHref(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== 'ALL') {
      sp.set(key, String(value));
    }
  }
  const qs = sp.toString();
  return qs ? `/imobiliarias?${qs}` : '/imobiliarias';
}

export default async function AgenciesListPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const search = sp.search?.trim() ?? '';
  const type =
    sp.type === 'IMOBILIARIA' || sp.type === 'HOUSE' ? (sp.type as EntityTypeValue) : 'ALL';
  const page = Math.max(1, Number(sp.page) || 1);

  const { items, total, totalPages, pageSize } = await listAgencies({
    search,
    type,
    page,
    pageSize: 10,
  });

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <>
      <PageHeader
        title="Imobiliárias & Houses"
        description="Gerencie as entidades cadastradas e seus gerentes responsáveis."
        actions={
          <Link href="/imobiliarias/nova">
            <Button>
              <Plus className="h-4 w-4" />
              Nova Imobiliária/House
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {FILTERS.map((filter) => {
            const active = type === filter.value;
            return (
              <Link
                key={filter.value}
                href={buildHref({ search, type: filter.value })}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  active ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50',
                )}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <form action="/imobiliarias" method="get" className="relative w-full sm:w-72">
          {type !== 'ALL' && <input type="hidden" name="type" value={type} />}
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Buscar por nome, CNPJ ou cidade..."
            className="pl-9"
          />
        </form>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-semibold">Nome Fantasia</th>
                <th className="px-6 py-3 font-semibold">Tipo</th>
                <th className="px-6 py-3 font-semibold">CNPJ</th>
                <th className="hidden px-6 py-3 font-semibold md:table-cell">Cidade/UF</th>
                <th className="hidden px-6 py-3 font-semibold lg:table-cell">Gerente</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="hidden px-6 py-3 font-semibold xl:table-cell">Criado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Building2 className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Nenhum resultado encontrado
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {search
                        ? 'Tente ajustar a busca ou os filtros.'
                        : 'Cadastre a primeira imobiliária ou house.'}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((agency) => {
                  const manager = agency.users[0];
                  return (
                    <tr key={agency.id} className="group transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/imobiliarias/${agency.id}`}
                          className="group-hover:text-brand-700 font-medium text-slate-900"
                        >
                          {agency.tradeName}
                        </Link>
                        <p className="truncate text-xs text-slate-400">{agency.legalName}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <EntityTypeBadge type={agency.type} />
                      </td>
                      <td className="px-6 py-3.5 tabular-nums text-slate-600">
                        {formatCNPJ(agency.cnpj)}
                      </td>
                      <td className="hidden px-6 py-3.5 text-slate-600 md:table-cell">
                        {agency.city}/{agency.state}
                      </td>
                      <td className="hidden px-6 py-3.5 text-slate-600 lg:table-cell">
                        {manager?.fullName ?? '—'}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={agency.status} />
                      </td>
                      <td className="hidden px-6 py-3.5 text-slate-500 xl:table-cell">
                        {formatDate(agency.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm text-slate-500">
            <span>
              Exibindo <span className="font-medium text-slate-700">{from}</span>–
              <span className="font-medium text-slate-700">{to}</span> de{' '}
              <span className="font-medium text-slate-700">{total}</span>
            </span>
            <div className="flex items-center gap-2">
              <PageLink
                disabled={page <= 1}
                href={buildHref({ search, type, page: page - 1 })}
                label="Anterior"
              />
              <span className="px-2 text-xs">
                Página {page} de {totalPages}
              </span>
              <PageLink
                disabled={page >= totalPages}
                href={buildHref({ search, type, page: page + 1 })}
                label="Próxima"
              />
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

function PageLink({ href, label, disabled }: { href: string; label: string; disabled: boolean }) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-300">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}
