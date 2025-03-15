import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const { pathname, origin } = request.nextUrl;

  const isPublicPath = pathname.startsWith("/auth/");
  const accessToken = request.cookies.get("AccessToken")?.value;

  // 인증된 사용자가 인증 페이지에 접근할 경우 홈으로 리다이렉트
  if (accessToken && isPublicPath) {
    return NextResponse.redirect(`${origin}${basePath}/`);
  }
  
  // 인증되지 않은 사용자가 보호된 경로에 접근할 경우 로그인 페이지로 리다이렉트
  if (!accessToken && !isPublicPath) {
    const loginUrl = new URL(`${basePath}/auth/login`, origin);
    loginUrl.searchParams.set("callbackUrl", `${basePath}${pathname}`);
    return NextResponse.redirect(loginUrl);
  }
  
  // 인증된 경우 원래 요청한 경로로 진행
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};