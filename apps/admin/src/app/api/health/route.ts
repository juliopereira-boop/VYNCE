import { NextResponse } from 'next/server';
import { prisma } from '@vynce/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Remove qualquer string de conexão / credencial de mensagens de erro. */
function sanitize(message: unknown): string {
  const text = String(message ?? '').slice(0, 600);
  return text
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, 'postgresql://***')
    .replace(/:[^:@\s/]+@/g, ':***@');
}

export async function GET() {
  const env = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasDirectUrl: Boolean(process.env.DIRECT_URL),
  };

  // 1) Conseguimos conectar ao banco?
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    const e = error as { code?: string; name?: string; message?: string };
    return NextResponse.json(
      {
        ok: false,
        stage: 'connection',
        hint:
          'Não conectou ao banco. Confira DATABASE_URL/DIRECT_URL (host, porta, senha) e se fez Redeploy após salvar as variáveis.',
        code: e.code,
        name: e.name,
        message: sanitize(e.message),
        env,
      },
      { status: 503 },
    );
  }

  // 2) As tabelas existem?
  try {
    const agencies = await prisma.agency.count();
    return NextResponse.json({ ok: true, stage: 'ready', agencies, env });
  } catch (error) {
    const e = error as { code?: string; name?: string; message?: string };
    return NextResponse.json(
      {
        ok: false,
        stage: 'schema',
        hint:
          'Conectou ao banco, mas as tabelas não existem. Rode o script packages/database/supabase-setup.sql no SQL Editor do Supabase.',
        code: e.code,
        name: e.name,
        message: sanitize(e.message),
        env,
      },
      { status: 503 },
    );
  }
}
