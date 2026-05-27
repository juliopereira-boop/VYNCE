'use client';

import { Building2, ChevronRight, LayoutDashboard, Settings, UserRound, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@vynce/ui';

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
};

const NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Imobiliárias & Houses', href: '/imobiliarias', icon: Building2 },
  { label: 'Corretores', href: '/corretores', icon: Users, soon: true },
  { label: 'Configurações', href: '/configuracoes', icon: Settings, soon: true },
];

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-bold text-brand-700 shadow-sm">
        V
      </span>
      <div className="leading-tight">
        <span className="block font-display text-base font-bold tracking-tight text-white">
          Vynce
        </span>
        <span className="block text-[11px] font-medium text-white/60">CRM Imobiliário</span>
      </div>
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-gradient-to-b from-[#4ea17f] to-[#1f5d54] lg:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">
          Menu
        </p>
        {NAV.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          const content = (
            <>
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  active ? 'text-white' : 'text-white/70 group-hover:text-white',
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.soon && (
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
                  em breve
                </span>
              )}
            </>
          );

          if (item.soon) {
            return (
              <span
                key={item.href}
                className="group flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/50"
              >
                {content}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white',
              )}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-white">Administrador</p>
            <p className="truncate text-xs text-white/60">admin@vynce.com.br</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  const pathname = usePathname();
  const crumb =
    NAV.find((n) => pathname.startsWith(n.href))?.label ??
    (pathname.startsWith('/imobiliarias') ? 'Imobiliárias & Houses' : 'Vynce');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-1.5 text-sm text-slate-400 lg:hidden">
        <span className="font-display font-semibold text-brand-700">Vynce</span>
      </div>
      <div className="hidden items-center gap-1.5 text-sm text-slate-400 lg:flex">
        <span>Vynce</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-700">{crumb}</span>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
