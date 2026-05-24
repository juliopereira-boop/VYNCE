import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from '@vynce/validation';
import { deleteAgency, getAgencyById, updateAgency } from '@/server/agencies';
import { ConflictError, NotFoundError, zodErrorToFieldErrors } from '@/server/errors';
import { toAgencyDTO } from '@/lib/dto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const agency = await getAgencyById(id);
  if (!agency) {
    return NextResponse.json({ message: 'Não encontrado.' }, { status: 404 });
  }
  return NextResponse.json({ agency: toAgencyDTO(agency) });
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  try {
    const agency = await updateAgency(id, body);
    return NextResponse.json({ agency: toAgencyDTO(agency) });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ fieldErrors: zodErrorToFieldErrors(error) }, { status: 400 });
    }
    if (error instanceof ConflictError) {
      return NextResponse.json({ fieldErrors: error.fieldErrors }, { status: 409 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error('PATCH /api/agencies/[id]', error);
    return NextResponse.json({ message: 'Erro interno ao atualizar.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    await deleteAgency(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error('DELETE /api/agencies/[id]', error);
    return NextResponse.json({ message: 'Erro interno ao excluir.' }, { status: 500 });
  }
}
