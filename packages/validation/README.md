# @vynce/validation

Regras de validação e formatação compartilhadas entre cliente e servidor.
Baseado em **Zod**.

## Conteúdo

- **Schemas**: `createAgencySchema`, `updateAgencySchema`, `agencyFieldsSchema`,
  `managerCreateSchema`, `managerUpdateSchema`, `passwordSchema`.
- **Validadores**: `isValidCPF`, `isValidCNPJ` (com dígitos verificadores).
- **Formatadores/máscaras**: `formatCNPJ`, `formatCPF`, `formatCEP`, `formatPhone`.
- **Constantes**: `ENTITY_TYPES`, `USER_ROLES`, `BRAZILIAN_STATES`,
  `managerRoleForEntity()`.

## Exemplo

```ts
import { createAgencySchema, isValidCNPJ } from '@vynce/validation';

const result = createAgencySchema.safeParse(payload);
if (!result.success) {
  // result.error.issues → mensagens por campo
}
```

A política de senha exige no mínimo 8 caracteres, com maiúscula, minúscula,
número e caractere especial.
