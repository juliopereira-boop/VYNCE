import { Building2, Home } from 'lucide-react';
import { Badge } from '@vynce/ui';
import { ENTITY_TYPE_LABELS, type EntityTypeValue } from '@vynce/validation';

export function EntityTypeBadge({ type }: { type: EntityTypeValue }) {
  const isHouse = type === 'HOUSE';
  const Icon = isHouse ? Home : Building2;
  return (
    <Badge tone={isHouse ? 'amber' : 'brand'}>
      <Icon className="h-3 w-3" />
      {ENTITY_TYPE_LABELS[type]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  return (
    <Badge tone={status === 'ACTIVE' ? 'emerald' : 'slate'}>
      {status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
    </Badge>
  );
}
