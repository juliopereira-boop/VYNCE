/** Tipos de entidade — espelham o enum `EntityType` do Prisma. */
export const ENTITY_TYPES = ['IMOBILIARIA', 'HOUSE'] as const;
export type EntityTypeValue = (typeof ENTITY_TYPES)[number];

export const ENTITY_TYPE_LABELS: Record<EntityTypeValue, string> = {
  IMOBILIARIA: 'Imobiliária',
  HOUSE: 'House',
};

export const ENTITY_TYPE_DESCRIPTIONS: Record<EntityTypeValue, string> = {
  IMOBILIARIA:
    'Agência que intermedeia compra, venda e locação de imóveis de diversos proprietários e construtoras.',
  HOUSE:
    'Estrutura de vendas interna de uma incorporadora/construtora, focada nos próprios empreendimentos.',
};

/** Perfis de acesso — espelham o enum `UserRole` do Prisma. */
export const USER_ROLES = [
  'SUPER_ADMIN',
  'GERENTE_IMOBILIARIA',
  'GERENTE_HOUSE',
  'CORRETOR',
] as const;
export type UserRoleValue = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRoleValue, string> = {
  SUPER_ADMIN: 'Super Administrador',
  GERENTE_IMOBILIARIA: 'Gerente de Imobiliária',
  GERENTE_HOUSE: 'Gerente de House',
  CORRETOR: 'Corretor',
};

export const STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type StatusValue = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<StatusValue, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
};

/** Define o perfil do gerente conforme o tipo da entidade principal. */
export function managerRoleForEntity(type: EntityTypeValue): UserRoleValue {
  return type === 'HOUSE' ? 'GERENTE_HOUSE' : 'GERENTE_IMOBILIARIA';
}

/** Unidades federativas do Brasil. */
export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const;

export const UF_VALUES = BRAZILIAN_STATES.map((s) => s.value) as [string, ...string[]];
