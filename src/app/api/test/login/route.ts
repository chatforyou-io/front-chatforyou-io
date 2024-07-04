import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const token = 'test'; // 토큰 발급

  const response = NextResponse.json({ message: 'Token set successfully' }, { status: 200 });
  response.cookies.set('token', token, { path: '/' }); // 쿠키에 토큰 설정

  return response;
}