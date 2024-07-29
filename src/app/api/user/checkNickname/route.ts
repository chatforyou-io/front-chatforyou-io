import { userCheckNickname } from '@/src/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    const id = searchParams.get('id');
    if (!id) {
      throw new Error('id is required');
    }

    const result = await userCheckNickname(id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('fail check nickname: ' + error);
    return NextResponse.json({ result: 'fail check nickname' }, { status: 501 });
  }
}