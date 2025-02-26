import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('AccessToken');
  const refreshToken = req.cookies.get('RefreshToken');

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/chatforyouio/front/auth/login', req.url));
  }

  if (accessToken && refreshToken && req.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/chatforyouio/front/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
  ],
};