import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { userValidate } from '@/src/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const result = await userValidate(id);
  return NextResponse.json(result, { status: 201 });
}