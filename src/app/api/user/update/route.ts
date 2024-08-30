import { userUpdate } from '@/src/libs/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  const user: User = await req.json();

  try {
    const result = await userUpdate(user);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('fail update user: ' + error);
    return NextResponse.json({ result: 'fail update user' }, { status: 501 });
  }
}