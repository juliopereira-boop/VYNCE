# @vynce/ui

Design system do Vynce — componentes React estilizados com **Tailwind CSS**.

## Componentes

`Button`, `Input`, `Textarea`, `Select`, `Field`, `Label`, `Card`,
`CardHeader`, `CardBody`, `Badge`, `Spinner` e o utilitário `cn`.

## Uso

```tsx
import { Button, Field, Input } from '@vynce/ui';

<Field label="Nome Fantasia" required error={errors.tradeName}>
  <Input value={value} onChange={onChange} />
</Field>
<Button isLoading={saving}>Salvar</Button>
```

> O pacote é consumido como código TypeScript e transpilado pelo app via
> `transpilePackages`. O app consumidor deve incluir
> `../../packages/ui/src/**/*.{ts,tsx}` no `content` do Tailwind para gerar as
> classes utilizadas (já configurado em `apps/admin`).
