'use client';

import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@vynce/ui';

type ModuleItem = {
  label: string;
  href?: string;
  soon?: boolean;
  /** Path prefixes that mark this module as active. */
  match?: string[];
};

const MODULES: ModuleItem[] = [
  { label: 'Cadastros', href: '/dashboard', match: ['/dashboard', '/imobiliarias', '/corretores'] },
  { label: 'Comercial', soon: true },
  { label: 'Disponibilidade', soon: true },
  { label: 'Reservas', soon: true },
  { label: 'Financeiro', soon: true },
  { label: 'Relacionamento', soon: true },
];

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg font-bold text-white shadow-sm">
        V
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-slate-800">
        Vynce
      </span>
    </Link>
  );
}

function TopHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-3 lg:px-5">
      <button
        type="button"
        aria-label="Módulos"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-violet-600 transition-colors hover:bg-violet-50"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>

      <Brand />

      <form action="/imobiliarias" method="get" className="mx-auto hidden w-full max-w-2xl md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="search"
            placeholder="O que procura? Ex: imobiliária, CNPJ, cidade..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm text-slate-700 outline-none transition-colors focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
          <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:block">
            Alt + G
          </span>
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          aria-label="Mensagens"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Ajuda"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <span className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
          A
        </span>
      </div>
    </header>
  );
}

function ModuleNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-30 border-b border-brand-900/10 bg-gradient-to-r from-brand-700 to-brand-800 shadow-sm">
      <div className="flex h-12 items-stretch">
        <ul className="flex items-stretch">
          {MODULES.map((mod) => {
            const active = mod.match?.some((m) => pathname.startsWith(m));
            const base =
              'flex items-center gap-1.5 px-4 text-sm font-medium transition-colors whitespace-nowrap';

            if (mod.soon) {
              return (
                <li key={mod.label}>
                  <span
                    className={cn(base, 'cursor-not-allowed text-white/55')}
                    title="Em breve"
                  >
                    {mod.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </span>
                </li>
              );
            }

            return (
              <li key={mod.label}>
                <Link
                  href={mod.href!}
                  className={cn(
                    base,
                    active
                      ? 'bg-black/15 text-white shadow-inner'
                      : 'text-white/85 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {mod.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-1 pr-3">
          <span className="flex cursor-not-allowed items-center gap-1.5 px-3 text-sm font-medium text-white/70">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </span>
          <span className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-white/70">
            <Settings className="h-4 w-4" />
          </span>
        </div>
      </div>
    </nav>
  );
}

const CRUMB_LABELS: { match: string; label: string }[] = [
  { match: '/imobiliarias', label: 'Imobiliárias & Houses' },
  { match: '/dashboard', label: 'Cadastros' },
];

function Breadcrumb() {
  const pathname = usePathname();
  const current = CRUMB_LABELS.find((c) => pathname.startsWith(c.match));

  return (
    <div className="mb-4 flex justify-end">
      <nav className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm">
        <Link href="/dashboard" className="font-medium text-slate-600 hover:text-brand-700">
          Início
        </Link>
        {pathname !== '/dashboard' && current && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-medium text-slate-700">{current.label}</span>
          </>
        )}
      </nav>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopHeader />
      <ModuleNav />
      <main className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  );
}
