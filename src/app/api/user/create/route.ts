import { userCreate } from '@/src/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const user: User = await req.json();

  try {
    const result = await userCreate(user);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('fail create user: ' + error);
    return NextResponse.json({ result: 'fail create user' }, { status: 501 });
  }
}