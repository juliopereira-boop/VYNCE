import { ZodError } from '@vynce/validation';

/** Mapa de erros por campo (chaves em dot-path, ex.: "manager.email"). */
export type FieldErrors = Record<string, string>;

export class ConflictError extends Error {
  fieldErrors: FieldErrors;
  constructor(fieldErrors: FieldErrors) {
    super('Conflito de dados.');
    this.name = 'ConflictError';
    this.fieldErrors = fieldErrors;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Registro não encontrado.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** Converte um ZodError em um mapa plano campo → mensagem. */
export function zodErrorToFieldErrors(error: ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!result[path]) {
      result[path] = issue.message;
    }
  }
  return result;
}
