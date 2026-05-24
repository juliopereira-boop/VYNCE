import { z } from 'zod';
import { ENTITY_TYPES, STATUSES, UF_VALUES } from './constants';
import { isValidCNPJ, isValidCPF, onlyDigits } from './utils';

const requiredText = (label: string, max = 255) =>
  z
    .string({ required_error: `${label} é obrigatório.` })
    .trim()
    .min(1, `${label} é obrigatório.`)
    .max(max, `${label} deve ter no máximo ${max} caracteres.`);

const optionalText = (max = 255) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v : undefined));

const cnpjSchema = z
  .string({ required_error: 'CNPJ é obrigatório.' })
  .transform(onlyDigits)
  .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos.')
  .refine(isValidCNPJ, 'CNPJ inválido.');

const cpfSchema = z
  .string({ required_error: 'CPF é obrigatório.' })
  .transform(onlyDigits)
  .refine((v) => v.length === 11, 'CPF deve ter 11 dígitos.')
  .refine(isValidCPF, 'CPF inválido.');

const phoneSchema = z
  .string({ required_error: 'Telefone é obrigatório.' })
  .transform(onlyDigits)
  .refine((v) => v.length === 10 || v.length === 11, 'Telefone deve ter 10 ou 11 dígitos.');

const cepSchema = z
  .string({ required_error: 'CEP é obrigatório.' })
  .transform(onlyDigits)
  .refine((v) => v.length === 8, 'CEP deve ter 8 dígitos.');

const websiteSchema = z
  .string()
  .trim()
  .url('Website deve ser uma URL válida.')
  .max(255)
  .optional()
  .or(z.literal(''))
  .transform((v) => (v ? v : undefined));

/** Política de senha: mín. 8, maiúscula, minúscula, número e caractere especial. */
export const passwordSchema = z
  .string({ required_error: 'Senha é obrigatória.' })
  .min(8, 'A senha deve ter ao menos 8 caracteres.')
  .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
  .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
  .regex(/[0-9]/, 'A senha deve conter ao menos um número.')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial.');

/** Campos da entidade (Imobiliária / House). */
export const agencyFieldsSchema = z.object({
  type: z.enum(ENTITY_TYPES, { required_error: 'Selecione o tipo de entidade.' }),
  tradeName: requiredText('Nome Fantasia'),
  legalName: requiredText('Razão Social'),
  cnpj: cnpjSchema,
  stateRegistration: optionalText(30),
  creciJuridico: requiredText('CRECI Jurídico', 30),
  phone: phoneSchema,
  email: z
    .string({ required_error: 'E-mail comercial é obrigatório.' })
    .trim()
    .toLowerCase()
    .email('E-mail comercial inválido.'),
  website: websiteSchema,
  zipCode: cepSchema,
  street: requiredText('Logradouro'),
  number: requiredText('Número', 20),
  complement: optionalText(100),
  district: requiredText('Bairro'),
  city: requiredText('Cidade'),
  state: z.enum(UF_VALUES, { required_error: 'Selecione o estado (UF).' }),
  logoUrl: optionalText(500),
  description: optionalText(2000),
  status: z.enum(STATUSES).optional(),
});

const managerBaseSchema = z.object({
  fullName: requiredText('Nome completo'),
  cpf: cpfSchema,
  creci: requiredText('CRECI individual', 30),
  email: z
    .string({ required_error: 'E-mail de login é obrigatório.' })
    .trim()
    .toLowerCase()
    .email('E-mail de login inválido.'),
  phone: phoneSchema,
});

const passwordPair = {
  password: passwordSchema,
  confirmPassword: z.string({ required_error: 'Confirmação de senha é obrigatória.' }),
};

/** Gerente na criação — senha obrigatória. */
export const managerCreateSchema = managerBaseSchema
  .extend(passwordPair)
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'As senhas não conferem.',
      });
    }
  });

/** Gerente na edição — senha opcional (só altera se informada). */
export const managerUpdateSchema = managerBaseSchema
  .extend({
    password: passwordSchema.optional().or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'As senhas não conferem.',
      });
    }
  });

/** Payload completo de criação: entidade + gerente. */
export const createAgencySchema = agencyFieldsSchema.extend({
  manager: managerCreateSchema,
});

/** Payload completo de edição. */
export const updateAgencySchema = agencyFieldsSchema.extend({
  manager: managerUpdateSchema,
});

export type AgencyFieldsInput = z.input<typeof agencyFieldsSchema>;
export type CreateAgencyInput = z.input<typeof createAgencySchema>;
export type CreateAgencyOutput = z.output<typeof createAgencySchema>;
export type UpdateAgencyInput = z.input<typeof updateAgencySchema>;
export type UpdateAgencyOutput = z.output<typeof updateAgencySchema>;
export type ManagerCreateInput = z.input<typeof managerCreateSchema>;
