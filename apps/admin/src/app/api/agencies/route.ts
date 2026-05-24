import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from '@vynce/validation';
import { createAgency, listAgencies } from '@/server/agencies';
import { ConflictError, zodErrorToFieldErrors } from '@/server/errors';
import { toAgencyDTO } from '@/lib/dto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get('type') ?? undefined;

  const result = await listAgencies({
    search: searchParams.get('search') ?? undefined,
    type: type === 'IMOBILIARIA' || type === 'HOUSE' ? type : 'ALL',
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 10,
  });

  return NextResponse.json({
    ...result,
    items: result.items.map(toAgencyDTO),
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  try {
    const agency = await createAgency(body);
    return NextResponse.json({ agency: toAgencyDTO(agency) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ fieldErrors: zodErrorToFieldErrors(error) }, { status: 400 });
    }
    if (error instanceof ConflictError) {
      return NextResponse.json({ fieldErrors: error.fieldErrors }, { status: 409 });
    }
    console.error('POST /api/agencies', error);
    return NextResponse.json({ message: 'Erro interno ao cadastrar.' }, { status: 500 });
  }
}
