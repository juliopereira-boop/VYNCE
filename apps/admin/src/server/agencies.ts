import bcrypt from 'bcryptjs';
import { Prisma, prisma, type Agency, type AgencyStatus, type User } from '@vynce/database';
import {
  ZodError,
  createAgencySchema,
  managerRoleForEntity,
  updateAgencySchema,
  type EntityTypeValue,
} from '@vynce/validation';
import { ConflictError, NotFoundError } from './errors';

export type AgencyWithManager = Agency & { users: User[] };

export type ListParams = {
  search?: string;
  type?: EntityTypeValue | 'ALL';
  page?: number;
  pageSize?: number;
};

export type ListResult = {
  items: AgencyWithManager[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const managerInclude = { users: { where: { isManager: true }, take: 1 } } as const;

export async function listAgencies(params: ListParams = {}): Promise<ListResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 10));

  const where: Prisma.AgencyWhereInput = {};
  if (params.type && params.type !== 'ALL') {
    where.type = params.type;
  }
  if (params.search?.trim()) {
    const s = params.search.trim();
    const digits = s.replace(/\D/g, '');
    where.OR = [
      { tradeName: { contains: s, mode: 'insensitive' } },
      { legalName: { contains: s, mode: 'insensitive' } },
      { city: { contains: s, mode: 'insensitive' } },
      ...(digits ? [{ cnpj: { contains: digits } }] : []),
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.agency.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: managerInclude,
    }),
    prisma.agency.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAgencyById(id: string): Promise<AgencyWithManager | null> {
  return prisma.agency.findUnique({ where: { id }, include: managerInclude });
}

export async function getAgencyStats() {
  const [total, imobiliarias, houses, active] = await prisma.$transaction([
    prisma.agency.count(),
    prisma.agency.count({ where: { type: 'IMOBILIARIA' } }),
    prisma.agency.count({ where: { type: 'HOUSE' } }),
    prisma.agency.count({ where: { status: 'ACTIVE' } }),
  ]);
  return { total, imobiliarias, houses, active };
}

export async function createAgency(input: unknown): Promise<AgencyWithManager> {
  const data = createAgencySchema.parse(input);
  const { manager, status, ...agency } = data;
  const passwordHash = await bcrypt.hash(manager.password, 10);

  try {
    return await prisma.agency.create({
      data: {
        ...agency,
        status: (status ?? 'ACTIVE') as AgencyStatus,
        users: {
          create: {
            fullName: manager.fullName,
            cpf: manager.cpf,
            creci: manager.creci,
            email: manager.email,
            phone: manager.phone,
            passwordHash,
            role: managerRoleForEntity(data.type),
            isManager: true,
          },
        },
      },
      include: managerInclude,
    });
  } catch (error) {
    throw translatePrismaError(error);
  }
}

export async function updateAgency(id: string, input: unknown): Promise<AgencyWithManager> {
  const data = updateAgencySchema.parse(input);

  const existing = await prisma.agency.findUnique({ where: { id }, include: managerInclude });
  if (!existing) {
    throw new NotFoundError('Imobiliária/House não encontrada.');
  }

  const { manager, status, ...agency } = data;
  const currentManager = existing.users[0];

  const managerData: Prisma.UserUpdateInput = {
    fullName: manager.fullName,
    cpf: manager.cpf,
    creci: manager.creci,
    email: manager.email,
    phone: manager.phone,
    role: managerRoleForEntity(data.type),
  };
  if (manager.password) {
    managerData.passwordHash = await bcrypt.hash(manager.password, 10);
  }

  try {
    return await prisma.agency.update({
      where: { id },
      data: {
        ...agency,
        status: (status ?? existing.status) as AgencyStatus,
        users: currentManager
          ? { update: { where: { id: currentManager.id }, data: managerData } }
          : {
              create: {
                fullName: manager.fullName,
                cpf: manager.cpf,
                creci: manager.creci,
                email: manager.email,
                phone: manager.phone,
                passwordHash: manager.password
                  ? await bcrypt.hash(manager.password, 10)
                  : await bcrypt.hash(Math.random().toString(36), 10),
                role: managerRoleForEntity(data.type),
                isManager: true,
              },
            },
      },
      include: managerInclude,
    });
  } catch (error) {
    throw translatePrismaError(error);
  }
}

export async function deleteAgency(id: string): Promise<void> {
  try {
    await prisma.agency.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError('Imobiliária/House não encontrada.');
    }
    throw error;
  }
}

/** Traduz erros de unicidade do Prisma para mensagens por campo. */
function translatePrismaError(error: unknown): unknown {
  if (error instanceof ZodError) return error;

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    const target = error.meta?.target;
    const fields = Array.isArray(target) ? target.join(',') : String(target ?? '');

    if (fields.includes('cnpj')) {
      return new ConflictError({ cnpj: 'Este CNPJ já está cadastrado.' });
    }
    if (fields.includes('email')) {
      return new ConflictError({ 'manager.email': 'Este e-mail de login já está em uso.' });
    }
    if (fields.includes('cpf')) {
      return new ConflictError({ 'manager.cpf': 'Este CPF já está cadastrado.' });
    }
    return new ConflictError({ _root: 'Registro duplicado.' });
  }

  return error;
}
