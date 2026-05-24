# Arquitetura

## Visão geral

Vynce é um **monorepo Turborepo** com workspaces do npm. A separação em
`apps/` e `packages/` permite compartilhar regras de negócio, tipos e UI entre
aplicações, mantendo cada peça com responsabilidade única.

```
┌──────────────────────────────────────────────────────────┐
│                       apps/admin                          │
│  Next.js (App Router)                                     │
│                                                           │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Páginas /  │→  │ Route         │→ │ Camada de       │  │
│  │  Componentes│   │ Handlers      │   │ serviços        │  │
│  │  (RSC + CC) │   │ (/api/*)      │   │ (src/server)    │  │
│  └─────────────┘   └──────────────┘   └───────┬─────────┘  │
└────────────────────────────────────────────────┼──────────┘
                                                  │
        ┌─────────────────────┬──────────────────┼───────────────┐
        ▼                     ▼                  ▼
  @vynce/validation     @vynce/ui          @vynce/database
  (Zod, máscaras)      (design system)    (Prisma + PostgreSQL)
```

## Pacotes

### `@vynce/database`

Encapsula o Prisma. Exporta um **singleton** de `PrismaClient` (evita esgotar
conexões em hot reload) e re-exporta os tipos/eneums gerados. Contém o
`schema.prisma`, as migrations e o `seed.ts`.

Modelos principais:

- **`Agency`** — a imobiliária ou house. O campo `type` (`EntityType`)
  diferencia as duas naturezas.
- **`User`** — usuários da entidade. O gerente/responsável é o usuário com
  `isManager = true` e papel `GERENTE_IMOBILIARIA` ou `GERENTE_HOUSE`. A relação
  `Agency 1—N User` usa `onDelete: Cascade`.

### `@vynce/validation`

Fonte única de verdade das regras de validação, **compartilhada entre cliente e
servidor**. Assim, o formulário e a API aplicam exatamente as mesmas regras.

- Schemas Zod (`createAgencySchema`, `updateAgencySchema`, `passwordSchema`...).
- Validadores de **CNPJ** e **CPF** com dígitos verificadores.
- Formatadores/máscaras (CNPJ, CPF, CEP, telefone).
- Constantes de domínio (tipos de entidade, perfis, UFs).

### `@vynce/ui`

Design system em React + Tailwind: `Button`, `Input`, `Select`, `Textarea`,
`Field`, `Card`, `Badge`, `Spinner` e o utilitário `cn`. Consumido como código
TypeScript e transpilado pelo Next via `transpilePackages`.

## A aplicação `apps/admin`

### Camadas

1. **Páginas (RSC)** — listagem, detalhe, dashboard e formulários. As páginas de
   leitura são Server Components que chamam a **camada de serviços**
   diretamente (sem self-fetch), o que é mais rápido e simples.
2. **Route Handlers (`/api/agencies`)** — a fronteira HTTP. Os formulários
   (Client Components) consomem esses endpoints para mutações (POST/PATCH/DELETE).
3. **Camada de serviços (`src/server`)** — regras de negócio e acesso a dados.
   É onde vive a lógica de criação/atualização (hash de senha, definição
   automática do papel do gerente, tradução de erros do Prisma). Está
   deliberadamente isolada do HTTP para permitir extração futura para um serviço
   NestJS dedicado.

### Tratamento de erros

A camada de serviços normaliza falhas:

- **`ZodError`** → `400` com um mapa `fieldErrors` (chaves em dot-path, ex.:
  `manager.email`).
- **`P2002` (unicidade) do Prisma** → `ConflictError` → `409`, mapeado para o
  campo correto (`cnpj`, `manager.email`, `manager.cpf`).
- **`P2025` (não encontrado)** → `NotFoundError` → `404`.

O mesmo formato de `fieldErrors` é consumido pelo formulário, que destaca os
campos com problema — independentemente de o erro ter vindo da validação no
cliente ou da resposta do servidor.

### Segurança de dados

O `passwordHash` nunca sai da camada de serviços: o `toAgencyDTO` produz um
objeto seguro (sem hash, com datas em ISO) tanto para as respostas da API quanto
para os dados passados a Client Components.

## Decisões e trade-offs

- **Next.js full-stack** em vez de um backend NestJS separado nesta fase: entrega
  o módulo ponta a ponta mais rápido. A camada de serviços isolada preserva o
  caminho de migração.
- **PostgreSQL + Prisma**: banco relacional robusto, migrations versionadas e
  tipos gerados.
- **Validação compartilhada (Zod)**: elimina divergência entre regras de
  cliente e servidor.
