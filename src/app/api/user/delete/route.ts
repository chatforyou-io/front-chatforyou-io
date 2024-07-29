import { userDelete } from '@/src/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest, params: { id: string }) {
  const id = params.id;

  try {
    const result = await userDelete(id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('fail delete user: ' + error);
    return NextResponse.json({ result: 'fail delete user' }, { status: 501 });
  }
}