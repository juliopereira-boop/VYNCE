import type { AgencyWithManager } from '@/server/agencies';

export type ManagerDTO = {
  id: string;
  fullName: string;
  cpf: string;
  creci: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

export type AgencyDTO = {
  id: string;
  type: 'IMOBILIARIA' | 'HOUSE';
  tradeName: string;
  legalName: string;
  cnpj: string;
  stateRegistration: string | null;
  creciJuridico: string;
  phone: string;
  email: string;
  website: string | null;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  logoUrl: string | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  manager: ManagerDTO | null;
};

export function toAgencyDTO(agency: AgencyWithManager): AgencyDTO {
  const manager = agency.users[0];
  return {
    id: agency.id,
    type: agency.type,
    tradeName: agency.tradeName,
    legalName: agency.legalName,
    cnpj: agency.cnpj,
    stateRegistration: agency.stateRegistration,
    creciJuridico: agency.creciJuridico,
    phone: agency.phone,
    email: agency.email,
    website: agency.website,
    zipCode: agency.zipCode,
    street: agency.street,
    number: agency.number,
    complement: agency.complement,
    district: agency.district,
    city: agency.city,
    state: agency.state,
    logoUrl: agency.logoUrl,
    description: agency.description,
    status: agency.status,
    createdAt: agency.createdAt.toISOString(),
    updatedAt: agency.updatedAt.toISOString(),
    manager: manager
      ? {
          id: manager.id,
          fullName: manager.fullName,
          cpf: manager.cpf,
          creci: manager.creci,
          email: manager.email,
          phone: manager.phone,
          role: manager.role,
          status: manager.status,
        }
      : null,
  };
}
