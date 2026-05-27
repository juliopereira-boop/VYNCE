import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { AppShell } from '@/components/app-shell';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: {
    default: 'Vynce — CRM Imobiliário',
    template: '%s · Vynce',
  },
  description: 'Plataforma de gestão para imobiliárias e houses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
