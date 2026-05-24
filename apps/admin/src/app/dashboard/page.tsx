import { Building2, Home, Layers, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button, Card, CardBody } from '@vynce/ui';
import { PageHeader } from '@/components/page-header';
import { EntityTypeBadge } from '@/components/entity-type-badge';
import { getAgencyStats, listAgencies } from '@/server/agencies';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Building2;
  accent: string;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([
    getAgencyStats(),
    listAgencies({ page: 1, pageSize: 5 }),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral das imobiliárias e houses cadastradas na plataforma."
        actions={
          <Link href="/imobiliarias/nova">
            <Button>
              <Plus className="h-4 w-4" />
              Nova Imobiliária/House
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total cadastrado"
          value={stats.total}
          icon={Layers}
          accent="bg-brand-50 text-brand-600"
        />
        <StatCard
          label="Imobiliárias"
          value={stats.imobiliarias}
          icon={Building2}
          accent="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Houses"
          value={stats.houses}
          icon={Home}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Ativas"
          value={stats.active}
          icon={ShieldCheck}
          accent="bg-amber-50 text-amber-600"
        />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">Cadastros recentes</h3>
          <Link
            href="/imobiliarias"
            className="text-brand-600 hover:text-brand-700 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>
        <CardBody className="p-0">
          {recent.items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                Nenhuma imobiliária ou house cadastrada ainda.
              </p>
              <Link href="/imobiliarias/nova" className="mt-3 inline-block">
                <Button size="sm" variant="subtle">
                  <Plus className="h-4 w-4" />
                  Cadastrar a primeira
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.items.map((agency) => (
                <li key={agency.id}>
                  <Link
                    href={`/imobiliarias/${agency.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{agency.tradeName}</p>
                      <p className="truncate text-sm text-slate-500">
                        {agency.city}/{agency.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <EntityTypeBadge type={agency.type} />
                      <span className="hidden text-sm text-slate-400 sm:block">
                        {formatDate(agency.createdAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </>
  );
}
