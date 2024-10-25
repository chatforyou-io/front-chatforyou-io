import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const { pathname, origin } = req.nextUrl;

  const isPublicPath = pathname.startsWith('/auth/');
  const token = await getToken({ req });

  if (token && isPublicPath) {
    // Skip the middleware for the login and signup pages
    return NextResponse.redirect(`${origin}${basePath}/`);
  }
  
  if (!token && !isPublicPath) {
    // Redirect to the login page if the user is not authenticated
    const loginUrl = new URL(`${basePath}/auth/login`, origin);
    loginUrl.searchParams.set('callbackUrl', `${basePath}${pathname}`);
    return NextResponse.redirect(loginUrl);
  }
	
  // If authenticated, proceed to the originally requested path
  return NextResponse.next();
}

// Execute the middleware if the path matches the matcher
export const config = {
  matcher: [
    /*
      * Match all request paths except for:
      * - API routes (/api/...)
      * - Static files (/_next/static/...)
      * - Image optimization files (/_next/image/...)
      * - Favicon file (/favicon.ico)
      * - Public images (/images/...)
     */
    '/chatforyouio/front',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};