import { userInfo } from '@/src/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const pwd = searchParams.get('pwd');
  
  if (!id) {
    throw new Error('id is required');
  }

  if (!pwd) {
    throw new Error('pwd is required');
  }

  try {

    const result = await userInfo(id, pwd);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('fail info: ' + error);
    return NextResponse.json({ result: 'fail info' }, { status: 501 });
  }
}