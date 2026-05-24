# Deploy na Vercel

Este guia descreve como publicar o painel **`apps/admin`** na Vercel. Como o
projeto usa **Prisma + PostgreSQL**, você precisa de um banco PostgreSQL
acessível pela internet (a Vercel é serverless e não hospeda banco).

## 1. Provisione um PostgreSQL

Use qualquer provedor gerenciado. Opções comuns:

- **Vercel Postgres** (Neon por baixo) — integra direto no projeto Vercel.
- **Neon** (https://neon.tech) — free tier generoso, pooler embutido.
- **Supabase** (https://supabase.com).

> **Importante (serverless):** funções serverless abrem muitas conexões curtas.
> Use a **connection string com pooling** (PgBouncer). No Neon/Vercel Postgres é
> a URL marcada como _Pooled_. Se necessário, acrescente
> `?pgbouncer=true&connection_limit=1` à `DATABASE_URL`.

## 2. Variáveis de ambiente na Vercel

No projeto Vercel → **Settings → Environment Variables**, defina:

| Variável       | Valor                                                            |
| -------------- | --------------------------------------------------------------- |
| `DATABASE_URL` | string de conexão **pooled** do seu PostgreSQL (`postgresql://…`) |

Aplique aos ambientes **Production**, **Preview** e **Development**.

## 3. Configuração do projeto Vercel (monorepo)

Ao importar o repositório na Vercel:

1. **Root Directory:** selecione **`apps/admin`**.
   A Vercel detecta o monorepo (Turborepo + npm workspaces), roda o
   `npm install` na **raiz** do repositório e o build em `apps/admin`.
2. **Framework Preset:** `Next.js` (detectado automaticamente).
3. **Build Command / Install Command / Output:** deixe os padrões.

O que já está preparado no código para a Vercel:

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
# Use a connection string DIRETA (não-pooled) para migrar, se o provedor oferecer.
export DATABASE_URL="postgresql://…(produção)…"
npm run db:deploy        # prisma migrate deploy
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
