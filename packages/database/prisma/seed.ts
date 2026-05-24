import { PrismaClient, EntityType, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type Seed = {
  agency: {
    type: EntityType;
    tradeName: string;
    legalName: string;
    cnpj: string;
    creciJuridico: string;
    phone: string;
    email: string;
    website?: string;
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    description?: string;
  };
  manager: {
    fullName: string;
    cpf: string;
    creci: string;
    email: string;
    phone: string;
  };
};

const data: Seed[] = [
  {
    agency: {
      type: EntityType.IMOBILIARIA,
      tradeName: 'Horizonte Imóveis',
      legalName: 'Horizonte Negócios Imobiliários Ltda',
      cnpj: '55545884119809',
      creciJuridico: 'J-12345',
      phone: '1133224455',
      email: 'contato@horizonteimoveis.com.br',
      website: 'https://horizonteimoveis.com.br',
      zipCode: '01310100',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Conjunto 142',
      district: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      description:
        'Imobiliária full-service atuando em compra, venda e locação na capital paulista.',
    },
    manager: {
      fullName: 'Marina Albuquerque',
      cpf: '88060358359',
      creci: 'F-98765',
      email: 'marina@horizonteimoveis.com.br',
      phone: '11988887777',
    },
  },
  {
    agency: {
      type: EntityType.HOUSE,
      tradeName: 'Vértice Vendas',
      legalName: 'Vértice Incorporações S.A.',
      cnpj: '62626658164600',
      creciJuridico: 'J-54321',
      phone: '4132109876',
      email: 'vendas@verticeincorporadora.com.br',
      website: 'https://verticeincorporadora.com.br',
      zipCode: '80250060',
      street: 'Rua Comendador Araújo',
      number: '450',
      district: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      description: 'House de vendas exclusiva dos empreendimentos da Vértice Incorporações.',
    },
    manager: {
      fullName: 'Rafael Toledo',
      cpf: '23082063497',
      creci: 'F-44556',
      email: 'rafael@verticeincorporadora.com.br',
      phone: '41999991234',
    },
  },
  {
    agency: {
      type: EntityType.IMOBILIARIA,
      tradeName: 'Litoral Prime',
      legalName: 'Litoral Prime Intermediação Imobiliária Eireli',
      cnpj: '40213507424851',
      creciJuridico: 'J-22110',
      phone: '4833445566',
      email: 'atendimento@litoralprime.com.br',
      zipCode: '88015600',
      street: 'Avenida Beira Mar Norte',
      number: '2100',
      complement: 'Sala 8',
      district: 'Centro',
      city: 'Florianópolis',
      state: 'SC',
      description: 'Especializada em imóveis de alto padrão no litoral catarinense.',
    },
    manager: {
      fullName: 'Camila Espíndola',
      cpf: '85531364504',
      creci: 'F-77889',
      email: 'camila@litoralprime.com.br',
      phone: '48988765432',
    },
  },
];

async function main() {
  console.log('🌱 Seeding Vynce database...');

  for (const entry of data) {
    const passwordHash = await bcrypt.hash('Vynce@2026', 10);
    const role =
      entry.agency.type === EntityType.HOUSE
        ? UserRole.GERENTE_HOUSE
        : UserRole.GERENTE_IMOBILIARIA;

    const agency = await prisma.agency.upsert({
      where: { cnpj: entry.agency.cnpj },
      update: {},
      create: {
        ...entry.agency,
        users: {
          create: {
            ...entry.manager,
            passwordHash,
            role,
            isManager: true,
          },
        },
      },
    });

    console.log(`  ✓ ${agency.tradeName} (${agency.type})`);
  }

  console.log('✅ Seed concluído. Senha padrão dos gerentes: Vynce@2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
