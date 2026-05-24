'use client';

import { Building2, Home, Loader2, Save, ShieldCheck, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Field, Input, Select, Textarea, cn } from '@vynce/ui';
import {
  BRAZILIAN_STATES,
  ENTITY_TYPE_DESCRIPTIONS,
  createAgencySchema,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatPhone,
  updateAgencySchema,
  type EntityTypeValue,
} from '@vynce/validation';
import type { AgencyDTO } from '@/lib/dto';

type ManagerValues = {
  fullName: string;
  cpf: string;
  creci: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type FormValues = {
  type: EntityTypeValue;
  tradeName: string;
  legalName: string;
  cnpj: string;
  stateRegistration: string;
  creciJuridico: string;
  phone: string;
  email: string;
  website: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  logoUrl: string;
  description: string;
  manager: ManagerValues;
};

function buildInitial(initial?: AgencyDTO): FormValues {
  return {
    type: initial?.type ?? 'IMOBILIARIA',
    tradeName: initial?.tradeName ?? '',
    legalName: initial?.legalName ?? '',
    cnpj: initial ? formatCNPJ(initial.cnpj) : '',
    stateRegistration: initial?.stateRegistration ?? '',
    creciJuridico: initial?.creciJuridico ?? '',
    phone: initial ? formatPhone(initial.phone) : '',
    email: initial?.email ?? '',
    website: initial?.website ?? '',
    zipCode: initial ? formatCEP(initial.zipCode) : '',
    street: initial?.street ?? '',
    number: initial?.number ?? '',
    complement: initial?.complement ?? '',
    district: initial?.district ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    logoUrl: initial?.logoUrl ?? '',
    description: initial?.description ?? '',
    manager: {
      fullName: initial?.manager?.fullName ?? '',
      cpf: initial?.manager ? formatCPF(initial.manager.cpf) : '',
      creci: initial?.manager?.creci ?? '',
      email: initial?.manager?.email ?? '',
      phone: initial?.manager ? formatPhone(initial.manager.phone) : '',
      password: '',
      confirmPassword: '',
    },
  };
}

export function AgencyForm({ mode, initial }: { mode: 'create' | 'edit'; initial?: AgencyDTO }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() => buildInitial(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isHouse = values.type === 'HOUSE';

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    clearError(key as string);
  }

  function setManager<K extends keyof ManagerValues>(key: K, value: ManagerValues[K]) {
    setValues((prev) => ({ ...prev, manager: { ...prev.manager, [key]: value } }));
    clearError(`manager.${key}`);
  }

  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function lookupCep(raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;
      setValues((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        district: data.bairro || prev.district,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
    } catch {
      // Busca de CEP é best-effort; ignora falhas de rede.
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const schema = mode === 'create' ? createAgencySchema : updateAgencySchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      setFormError('Verifique os campos destacados antes de continuar.');
      return;
    }

    setSubmitting(true);
    try {
      const url = mode === 'create' ? '/api/agencies' : `/api/agencies/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/imobiliarias/${data.agency.id}`);
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        setFormError('Não foi possível salvar. Verifique os campos destacados.');
      } else {
        setFormError(data.message ?? 'Erro ao salvar. Tente novamente.');
      }
    } catch {
      setFormError('Erro de conexão. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Tipo de entidade */}
      <Card>
        <CardHeader
          title="Tipo de entidade"
          description="Define o perfil de acesso e as permissões iniciais do cadastro."
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            <TypeOption
              active={!isHouse}
              icon={Building2}
              title="Imobiliária"
              description={ENTITY_TYPE_DESCRIPTIONS.IMOBILIARIA}
              onClick={() => setField('type', 'IMOBILIARIA')}
            />
            <TypeOption
              active={isHouse}
              icon={Home}
              title="House"
              description={ENTITY_TYPE_DESCRIPTIONS.HOUSE}
              onClick={() => setField('type', 'HOUSE')}
            />
          </div>
        </CardBody>
      </Card>

      {/* Identificação */}
      <Card>
        <CardHeader title="Identificação" description="Dados cadastrais e registro profissional." />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome Fantasia" required error={errors.tradeName} className="sm:col-span-1">
            <Input
              value={values.tradeName}
              invalid={!!errors.tradeName}
              onChange={(e) => setField('tradeName', e.target.value)}
              placeholder="Ex.: Horizonte Imóveis"
            />
          </Field>
          <Field label="Razão Social" required error={errors.legalName}>
            <Input
              value={values.legalName}
              invalid={!!errors.legalName}
              onChange={(e) => setField('legalName', e.target.value)}
              placeholder="Ex.: Horizonte Negócios Imobiliários Ltda"
            />
          </Field>
          <Field label="CNPJ" required error={errors.cnpj}>
            <Input
              value={values.cnpj}
              invalid={!!errors.cnpj}
              inputMode="numeric"
              onChange={(e) => setField('cnpj', formatCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
            />
          </Field>
          <Field label="Inscrição Estadual" error={errors.stateRegistration} hint="Se aplicável.">
            <Input
              value={values.stateRegistration}
              onChange={(e) => setField('stateRegistration', e.target.value)}
              placeholder="Opcional"
            />
          </Field>
          <Field label="CRECI Jurídico" required error={errors.creciJuridico}>
            <Input
              value={values.creciJuridico}
              invalid={!!errors.creciJuridico}
              onChange={(e) => setField('creciJuridico', e.target.value.toUpperCase())}
              placeholder="Ex.: J-12345"
            />
          </Field>
        </CardBody>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader title="Contato" description="Canais de comunicação da empresa." />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefone Comercial" required error={errors.phone}>
            <Input
              value={values.phone}
              invalid={!!errors.phone}
              inputMode="tel"
              onChange={(e) => setField('phone', formatPhone(e.target.value))}
              placeholder="(11) 3322-4455"
            />
          </Field>
          <Field label="E-mail Comercial" required error={errors.email}>
            <Input
              type="email"
              value={values.email}
              invalid={!!errors.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="contato@empresa.com.br"
            />
          </Field>
          <Field label="Website" error={errors.website} className="sm:col-span-2">
            <Input
              value={values.website}
              invalid={!!errors.website}
              onChange={(e) => setField('website', e.target.value)}
              placeholder="https://www.empresa.com.br"
            />
          </Field>
        </CardBody>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader title="Endereço" description="Informe o CEP para preenchimento automático." />
        <CardBody className="grid gap-4 sm:grid-cols-6">
          <Field label="CEP" required error={errors.zipCode} className="sm:col-span-2">
            <div className="relative">
              <Input
                value={values.zipCode}
                invalid={!!errors.zipCode}
                inputMode="numeric"
                onChange={(e) => setField('zipCode', formatCEP(e.target.value))}
                onBlur={(e) => lookupCep(e.target.value)}
                placeholder="00000-000"
              />
              {cepLoading && (
                <Loader2 className="text-brand-500 absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
          </Field>
          <Field label="Logradouro" required error={errors.street} className="sm:col-span-4">
            <Input
              value={values.street}
              invalid={!!errors.street}
              onChange={(e) => setField('street', e.target.value)}
              placeholder="Rua, Avenida, etc."
            />
          </Field>
          <Field label="Número" required error={errors.number} className="sm:col-span-2">
            <Input
              value={values.number}
              invalid={!!errors.number}
              onChange={(e) => setField('number', e.target.value)}
              placeholder="1000"
            />
          </Field>
          <Field label="Complemento" error={errors.complement} className="sm:col-span-4">
            <Input
              value={values.complement}
              onChange={(e) => setField('complement', e.target.value)}
              placeholder="Sala, bloco, andar (opcional)"
            />
          </Field>
          <Field label="Bairro" required error={errors.district} className="sm:col-span-2">
            <Input
              value={values.district}
              invalid={!!errors.district}
              onChange={(e) => setField('district', e.target.value)}
            />
          </Field>
          <Field label="Cidade" required error={errors.city} className="sm:col-span-2">
            <Input
              value={values.city}
              invalid={!!errors.city}
              onChange={(e) => setField('city', e.target.value)}
            />
          </Field>
          <Field label="Estado (UF)" required error={errors.state} className="sm:col-span-2">
            <Select
              value={values.state}
              invalid={!!errors.state}
              onChange={(e) => setField('state', e.target.value)}
            >
              <option value="">Selecione</option>
              {BRAZILIAN_STATES.map((uf) => (
                <option key={uf.value} value={uf.value}>
                  {uf.value} — {uf.label}
                </option>
              ))}
            </Select>
          </Field>
        </CardBody>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardHeader title="Informações adicionais" description="Personalização e descrição." />
        <CardBody className="grid gap-4">
          <Field
            label="Logotipo (URL)"
            error={errors.logoUrl}
            hint="Cole a URL de uma imagem. Upload de arquivo será adicionado em breve."
          >
            <Input
              value={values.logoUrl}
              onChange={(e) => setField('logoUrl', e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Descrição breve" error={errors.description}>
            <Textarea
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Pequena descrição da empresa..."
            />
          </Field>
        </CardBody>
      </Card>

      {/* Gerente / Responsável */}
      <Card>
        <CardHeader
          title="Gerente / Responsável"
          description="Usuário administrador da entidade. Poderá gerenciar a própria base e cadastrar corretores."
          action={
            <span className="bg-brand-50 text-brand-700 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
              <UserCog className="h-3.5 w-3.5" />
              {isHouse ? 'Gerente de House' : 'Gerente de Imobiliária'}
            </span>
          }
        />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome Completo" required error={errors['manager.fullName']}>
            <Input
              value={values.manager.fullName}
              invalid={!!errors['manager.fullName']}
              onChange={(e) => setManager('fullName', e.target.value)}
            />
          </Field>
          <Field label="CPF" required error={errors['manager.cpf']}>
            <Input
              value={values.manager.cpf}
              invalid={!!errors['manager.cpf']}
              inputMode="numeric"
              onChange={(e) => setManager('cpf', formatCPF(e.target.value))}
              placeholder="000.000.000-00"
            />
          </Field>
          <Field label="CRECI (Individual)" required error={errors['manager.creci']}>
            <Input
              value={values.manager.creci}
              invalid={!!errors['manager.creci']}
              onChange={(e) => setManager('creci', e.target.value.toUpperCase())}
              placeholder="Ex.: F-98765"
            />
          </Field>
          <Field label="Telefone" required error={errors['manager.phone']}>
            <Input
              value={values.manager.phone}
              invalid={!!errors['manager.phone']}
              inputMode="tel"
              onChange={(e) => setManager('phone', formatPhone(e.target.value))}
              placeholder="(11) 98888-7777"
            />
          </Field>
          <Field
            label="E-mail (Login)"
            required
            error={errors['manager.email']}
            className="sm:col-span-2"
          >
            <Input
              type="email"
              value={values.manager.email}
              invalid={!!errors['manager.email']}
              onChange={(e) => setManager('email', e.target.value)}
              placeholder="gerente@empresa.com.br"
            />
          </Field>
          <Field
            label={mode === 'edit' ? 'Nova senha' : 'Senha'}
            required={mode === 'create'}
            error={errors['manager.password']}
            hint="Mín. 8 caracteres, com maiúscula, minúscula, número e símbolo."
          >
            <Input
              type="password"
              value={values.manager.password}
              invalid={!!errors['manager.password']}
              onChange={(e) => setManager('password', e.target.value)}
              placeholder={mode === 'edit' ? 'Deixe em branco para manter' : '••••••••'}
              autoComplete="new-password"
            />
          </Field>
          <Field
            label="Confirmação de Senha"
            required={mode === 'create'}
            error={errors['manager.confirmPassword']}
          >
            <Input
              type="password"
              value={values.manager.confirmPassword}
              invalid={!!errors['manager.confirmPassword']}
              onChange={(e) => setManager('confirmPassword', e.target.value)}
              autoComplete="new-password"
            />
          </Field>
        </CardBody>
      </Card>

      {formError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <ShieldCheck className="h-4 w-4" />
          {formError}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={submitting}>
          {!submitting && <Save className="h-4 w-4" />}
          {mode === 'create' ? 'Cadastrar' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  );
}

function TypeOption({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: typeof Building2;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
        active
          ? 'border-brand-500 bg-brand-50/60 ring-brand-500 ring-1'
          : 'border-slate-200 bg-white hover:border-slate-300',
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500',
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className={cn('block font-semibold', active ? 'text-brand-800' : 'text-slate-800')}>
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </button>
  );
}
