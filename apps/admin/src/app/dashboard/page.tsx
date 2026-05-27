import {
  BarChart3,
  Building2,
  Home,
  LifeBuoy,
  Mail,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { cn } from '@vynce/ui';
import { PageHeader } from '@/components/page-header';
import { getAgencyStats, listAgencies } from '@/server/agencies';

export const metadata: Metadata = { title: 'Cadastros' };
export const dynamic = 'force-dynamic';

type Feature = {
  title: string;
  description: string;
  href?: string;
  soon?: boolean;
  icon: typeof Building2;
};

const FEATURES: Feature[] = [
  {
    title: 'Imobiliárias & Houses',
    description: 'Listar, buscar e gerenciar entidades cadastradas.',
    href: '/imobiliarias',
    icon: Building2,
  },
  {
    title: 'Nova Imobiliária/House',
    description: 'Cadastrar uma nova entidade e seu gerente.',
    href: '/imobiliarias/nova',
    icon: Plus,
  },
  {
    title: 'Corretores',
    description: 'Gestão de corretores vinculados.',
    soon: true,
    icon: Users,
  },
  {
    title: 'Relatórios',
    description: 'Indicadores e exportações.',
    soon: true,
    icon: BarChart3,
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 font-display text-base font-bold text-slate-800">{children}</h2>;
}

function IconTile({ icon: Icon }: { icon: typeof Building2 }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const inner = (
    <div
      className={cn(
        'group flex h-full items-center gap-4 rounded-xl border bg-white p-4 transition-all',
        feature.soon
          ? 'border-slate-200'
          : 'border-slate-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card',
      )}
    >
      <IconTile icon={feature.icon} />
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="truncate">{feature.title}</span>
          {feature.soon && (
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              em breve
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{feature.description}</p>
      </div>
    </div>
  );

  if (feature.soon) {
    return <div className="cursor-not-allowed opacity-70">{inner}</div>;
  }
  return (
    <Link href={feature.href!} className="block">
      {inner}
    </Link>
  );
}

export default async function CadastrosHome() {
  const [stats, recent] = await Promise.all([
    getAgencyStats(),
    listAgencies({ page: 1, pageSize: 4 }),
  ]);

  return (
    <>
      <PageHeader
        title="Cadastros"
        description="Aqui você encontra as funcionalidades do módulo de cadastros."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {recent.items.length > 0 && (
            <section>
              <SectionTitle>Seus últimos acessos</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {recent.items.slice(0, 3).map((agency) => {
                  const Icon = agency.type === 'HOUSE' ? Home : Building2;
                  return (
                    <Link
                      key={agency.id}
                      href={`/imobiliarias/${agency.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
                    >
                      <IconTile icon={Icon} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{agency.tradeName}</p>
                        <p className="truncate text-xs text-slate-500">
                          {agency.city}/{agency.state}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <SectionTitle>Funcionalidades</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-100 px-5 py-3">
              <h3 className="font-display text-sm font-bold text-slate-800">Resumo</h3>
            </div>
            <dl className="divide-y divide-slate-100">
              {[
                { label: 'Total cadastrado', value: stats.total },
                { label: 'Imobiliárias', value: stats.imobiliarias },
                { label: 'Houses', value: stats.houses },
                { label: 'Ativas', value: stats.active },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-2.5">
                  <dt className="text-sm text-slate-500">{row.label}</dt>
                  <dd className="font-display text-lg font-bold text-slate-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-5">
            <div className="mb-2 flex items-center gap-2 text-brand-800">
              <LifeBuoy className="h-5 w-5" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                Posso te ajudar?
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Precisa de ajuda com os cadastros? Comece criando sua primeira imobiliária ou house.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href="/imobiliarias/nova"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800"
              >
                <Plus className="h-4 w-4" />
                Nova Imobiliária/House
              </Link>
              <a
                href="mailto:suporte@vynce.com.br"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Mail className="h-4 w-4" />
                Falar com suporte
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
