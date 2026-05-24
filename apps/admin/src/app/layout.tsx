import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Vynce — CRM Imobiliário',
    template: '%s · Vynce',
  },
  description: 'Plataforma de gestão para imobiliárias e houses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
