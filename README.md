# Vynce — CRM Imobiliário

Plataforma de CRM para o mercado imobiliário, construída para **imobiliárias** e
**houses** (estruturas de venda de incorporadoras). Este repositório é um
**monorepo** que reúne as aplicações cliente, bibliotecas compartilhadas e a
camada de dados.

> **Fase atual:** módulo de **Cadastros** (Imobiliárias/Houses + gerente
> responsável) e o **Painel de Administração** para gerenciá-los.

---

## ✨ Funcionalidades desta fase

- **Painel de administração** com dashboard, listagem paginada/pesquisável,
  visualização de detalhes, criação e edição.
- **Cadastro de Imobiliária ou House** com seletor de tipo de entidade, que
  define automaticamente o perfil do gerente (`GERENTE_IMOBILIARIA` /
  `GERENTE_HOUSE`).
- **Cadastro do gerente/responsável** junto à entidade, com política de senha.
- **Validações brasileiras**: CNPJ e CPF com dígitos verificadores, máscaras de
  telefone/CEP, busca de endereço por CEP (ViaCEP).
- **API REST** (`/api/agencies`) com tratamento de erros de validação (400) e de
  conflito de unicidade (409).

## 🏗️ Arquitetura

Monorepo gerenciado com **Turborepo** + workspaces do npm.

```
vynce/
├── apps/
│   └── admin/            # Painel de administração (Next.js, App Router)
├── packages/
│   ├── database/         # Prisma schema, client e seed (PostgreSQL)
│   ├── validation/       # Schemas Zod, validadores e formatadores (CNPJ/CPF/CEP)
│   └── ui/               # Design system / componentes React + Tailwind
├── docs/                 # Documentação (arquitetura, design system)
├── docker-compose.yml    # PostgreSQL para desenvolvimento local
└── turbo.json            # Pipeline de tarefas do monorepo
```

### Stack

| Camada      | Tecnologia                                          |
| ----------- | --------------------------------------------------- |
| Frontend    | Next.js 15 (App Router), React 19, TypeScript       |
| Estilo      | Tailwind CSS 3, design system próprio (`@vynce/ui`) |
| Backend     | Next.js Route Handlers + camada de serviços         |
| ORM / Banco | Prisma 6 + PostgreSQL                               |
| Validação   | Zod (compartilhado entre cliente e servidor)        |
| Monorepo    | Turborepo + npm workspaces                          |

> A lógica de domínio vive em `apps/admin/src/server` (camada de serviços), já
> isolada da camada HTTP para facilitar uma futura extração para um serviço
> NestJS dedicado, conforme o produto evoluir.

## 🚀 Setup

### Pré-requisitos

- Node.js >= 20
- npm >= 10
- Docker (para o PostgreSQL local) ou um PostgreSQL acessível

### Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Subir o PostgreSQL local
docker compose up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Gerar o client e aplicar as migrations
npm run db:generate
npm run db:migrate

# 5. (Opcional) Popular com dados de exemplo
npm run db:seed

# 6. Rodar o ambiente de desenvolvimento
npm run dev
```

O painel ficará disponível em **http://localhost:3000**.

> Dados de exemplo: o seed cria 3 entidades. A senha padrão dos gerentes é
> `Vynce@2026`.

## 📜 Scripts (raiz)

| Comando              | Descrição                                  |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Sobe todas as apps em modo desenvolvimento |
| `npm run build`      | Build de produção de todo o monorepo       |
| `npm run lint`       | Lint de todos os pacotes                   |
| `npm run format`     | Formata o código com Prettier              |
| `npm run db:migrate` | Aplica migrations do Prisma                |
| `npm run db:seed`    | Popula o banco com dados de exemplo        |
| `npm run db:studio`  | Abre o Prisma Studio                       |

## 📚 Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — decisões de arquitetura e fluxo de dados.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — paleta, tipografia e componentes.
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — deploy na **Vercel** (banco, env vars, migrations).
- READMEs de cada pacote em `packages/*` e `apps/*`.

## 🗺️ Roadmap (próximas fases)

- Autenticação e autorização por perfil (RBAC).
- Cadastro e gestão de corretores vinculados a cada entidade.
- Módulos de imóveis, leads, funil de vendas e relatórios.
- Upload de logotipo (storage) e app mobile.
