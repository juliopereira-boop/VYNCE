# @vynce/admin

Painel de administração do Vynce — **Next.js 15** (App Router).

## Rotas

| Rota                        | Descrição                           |
| --------------------------- | ----------------------------------- |
| `/dashboard`                | Visão geral e cadastros recentes    |
| `/imobiliarias`             | Listagem paginada e pesquisável     |
| `/imobiliarias/nova`        | Cadastro de nova entidade + gerente |
| `/imobiliarias/[id]`        | Detalhes da entidade                |
| `/imobiliarias/[id]/editar` | Edição                              |
| `/api/agencies`             | API REST (GET lista, POST cria)     |
| `/api/agencies/[id]`        | API REST (GET, PATCH, DELETE)       |

## Estrutura

```
src/
├── app/            # Páginas (RSC) e Route Handlers (/api)
├── components/     # Componentes da aplicação (shell, formulário, tabela...)
├── server/         # Camada de serviços (regras de negócio + Prisma)
└── lib/            # DTOs e helpers de formatação
```

## Desenvolvimento

```bash
npm run dev    # http://localhost:3000
```

Requer `DATABASE_URL` (carregada de `.env.local`; veja `.env.example`).
