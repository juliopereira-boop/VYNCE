# @vynce/database

Camada de dados do Vynce: schema **Prisma**, client singleton e seed.
Banco: **PostgreSQL**.

## Uso

```ts
import { prisma } from '@vynce/database';

const agencies = await prisma.agency.findMany();
```

O pacote também re-exporta os tipos e enums gerados pelo Prisma
(`EntityType`, `UserRole`, `Agency`, `User`, `Prisma`, ...).

## Modelos

- **`Agency`** — imobiliária ou house (`type: EntityType`).
- **`User`** — usuários da entidade; o gerente tem `isManager = true`.

## Scripts

| Comando               | Descrição                    |
| --------------------- | ---------------------------- |
| `npm run db:generate` | Gera o Prisma Client         |
| `npm run db:migrate`  | Cria/aplica migrations (dev) |
| `npm run db:deploy`   | Aplica migrations (produção) |
| `npm run db:seed`     | Popula dados de exemplo      |
| `npm run db:studio`   | Abre o Prisma Studio         |

Requer a variável de ambiente `DATABASE_URL`.
