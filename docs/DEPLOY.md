# Deploy na Vercel

Este guia descreve como publicar o painel **`apps/admin`** na Vercel. Como o
projeto usa **Prisma + PostgreSQL**, você precisa de um banco PostgreSQL
acessível pela internet (a Vercel é serverless e não hospeda banco).

## 1. Provisione um PostgreSQL (Supabase)

Crie um projeto em **https://supabase.com**. Em **Project Settings → Database**
você encontra duas strings de conexão que vamos usar:

1. **Connection pooling → Transaction mode** (porta **6543**) — para o runtime
   serverless. Algo como:
   ```
   postgresql://postgres.<REF>:<SENHA>@aws-0-<região>.pooler.supabase.com:6543/postgres
   ```
2. **Direct connection** (porta **5432**) — para as migrations:
   ```
   postgresql://postgres.<REF>:<SENHA>@aws-0-<região>.pooler.supabase.com:5432/postgres
   ```
   (ou `db.<REF>.supabase.co:5432`, conforme o painel).

> **Por que duas?** Funções serverless abrem muitas conexões curtas, então o
> runtime usa o **pooler** (6543). Já as migrations precisam de uma conexão
> **direta** (5432) — o pooler em transaction mode não as suporta bem.

Outros provedores (Neon, Vercel Postgres) seguem a mesma ideia: URL _pooled_
para runtime, URL _direct_ para migrations.

## 2. Variáveis de ambiente na Vercel

No projeto Vercel → **Settings → Environment Variables**, defina (Production +
Preview):

| Variável       | Valor                                                                                  |
| -------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL` | string **pooled** (6543) **+** `?pgbouncer=true&connection_limit=1` no final           |
| `DIRECT_URL`   | string **direct** (5432)                                                               |

Exemplo de `DATABASE_URL`:
```
postgresql://postgres.<REF>:<SENHA>@aws-0-<região>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## 3. Configuração do projeto Vercel (monorepo)

Ao importar o repositório na Vercel:

1. **Root Directory:** selecione **`apps/admin`**.
   A Vercel detecta o monorepo (Turborepo + npm workspaces), roda o
   `npm install` na **raiz** do repositório e o build em `apps/admin`.
2. **Framework Preset:** `Next.js` (detectado automaticamente).
3. **Build Command / Install Command / Output:** deixe os padrões.

O que já está preparado no código para a Vercel:

- Há um **`apps/admin/vercel.json`** que fixa `framework: nextjs` e
  `buildCommand: next build`. O **Install Command** é deixado para a detecção de
  monorepo da Vercel (instala na raiz, resolvendo os workspaces).
- `packages/database` tem um script **`postinstall: prisma generate`**, então o
  Prisma Client é gerado em todo build (evita o erro de client desatualizado em
  builds com cache).
- O `schema.prisma` inclui `binaryTargets = ["native", "rhel-openssl-3.0.x"]`,
  compatível com o runtime serverless da Vercel.
- As rotas de API usam `export const runtime = 'nodejs'` (Prisma e bcrypt não
  rodam no Edge).
- `next.config.mjs` marca `@prisma/client` e `bcryptjs` como
  `serverExternalPackages`.

## 4. Aplique as migrations no banco de produção

O build da Vercel **não** roda migrations. Rode uma vez (e a cada mudança de
schema), apontando para o banco de produção:

```bash
# Aponte para o banco de produção. A migration usa a DIRECT_URL.
export DATABASE_URL="postgresql://…pooler…:6543/postgres?pgbouncer=true&connection_limit=1"
export DIRECT_URL="postgresql://…:5432/postgres"
npm run db:deploy        # prisma migrate deploy (usa DIRECT_URL)
# (opcional) popular dados de exemplo:
npm run db:seed
```

> Dica: você pode automatizar isso em um passo de CI/CD (GitHub Actions) que roda
> `prisma migrate deploy` antes/depois do deploy.

## 5. Deploy

- **Via dashboard:** clique em **Deploy** após importar o repo. Cada push para a
  branch de produção dispara um novo deploy.
- **Via CLI:**
  ```bash
  npm i -g vercel
  vercel link          # vincula a pasta ao projeto (escolha apps/admin como root)
  vercel --prod        # deploy de produção
  ```
  Em CI, autentique com `VERCEL_TOKEN` (`vercel --prod --token $VERCEL_TOKEN`).

## Checklist rápido

- [ ] PostgreSQL provisionado e acessível
- [ ] `DATABASE_URL` (pooled) definida nas env vars da Vercel
- [ ] Root Directory = `apps/admin`
- [ ] `prisma migrate deploy` executado no banco de produção
- [ ] Deploy disparado
