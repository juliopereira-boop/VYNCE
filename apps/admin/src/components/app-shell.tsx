'use client';

import { ChevronRight, HelpCircle, LayoutGrid, MessageSquare, Search } from 'lucide-react';
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
    <nav className="sticky top-16 z-30 bg-gradient-to-r from-brand-700 to-brand-800 shadow-sm">
      <div className="flex h-12 items-stretch px-3">
        {MODULES.map((mod) => {
          const active = mod.match?.some((m) => pathname.startsWith(m));
          return (
            <Link
              key={mod.label}
              href={mod.href!}
              className={cn(
                'group relative flex items-center px-5 text-sm font-semibold tracking-wide transition-colors',
                active ? 'text-white' : 'text-white/80 hover:text-white',
              )}
            >
              {mod.label}
              <span
                className={cn(
                  'absolute inset-x-4 bottom-0 h-[3px] rounded-t-full transition-all',
                  active ? 'bg-white' : 'bg-transparent group-hover:bg-white/40',
                )}
              />
            </Link>
          );
        })}
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
