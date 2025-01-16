import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = await getToken({ req });

  const isPublicPath = pathname.startsWith('/auth/');
  const rootUrl = new URL(basePath, origin);
  const loginUrl = new URL(`${basePath}/auth/login`, origin);

  if (token && isPublicPath) {
    return NextResponse.redirect(rootUrl);
  }
  
  if (!token && !isPublicPath) {
    return NextResponse.redirect(loginUrl);
  }
	
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)'
  ],
};