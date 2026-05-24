-- ============================================================================
-- Vynce — setup do banco no Supabase (ou qualquer PostgreSQL)
-- Cole este conteúdo no Supabase: SQL Editor → New query → Run.
-- É seguro rodar mais de uma vez (usa guardas IF NOT EXISTS).
-- ============================================================================

-- Tipos (enums) ----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "EntityType" AS ENUM ('IMOBILIARIA', 'HOUSE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'GERENTE_IMOBILIARIA', 'GERENTE_HOUSE', 'CORRETOR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "AgencyStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabela: agencies -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "agencies" (
    "id" TEXT NOT NULL,
    "type" "EntityType" NOT NULL DEFAULT 'IMOBILIARIA',
    "tradeName" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "stateRegistration" TEXT,
    "creciJuridico" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "zipCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "status" "AgencyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- Tabela: users ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "creci" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CORRETOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    "agencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Índices ----------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS "agencies_cnpj_key" ON "agencies"("cnpj");
CREATE INDEX IF NOT EXISTS "agencies_type_idx" ON "agencies"("type");
CREATE INDEX IF NOT EXISTS "agencies_tradeName_idx" ON "agencies"("tradeName");
CREATE UNIQUE INDEX IF NOT EXISTS "users_cpf_key" ON "users"("cpf");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_agencyId_idx" ON "users"("agencyId");

-- Chave estrangeira ------------------------------------------------------------
DO $$ BEGIN
  ALTER TABLE "users"
    ADD CONSTRAINT "users_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "agencies"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
