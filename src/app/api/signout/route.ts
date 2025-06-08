import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { signOut } from "@/src/libs/auth";

export async function GET(request: Request) {
  const sessionToken = cookies().get("SessionToken")?.value;
  
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/chatforyouio/front/auth/login", request.url));
  }

  // 세션 토큰 디코딩
  const decodedSessionToken = jwt.decode(sessionToken) as SessionTokenType;
  const { idx, id } = decodedSessionToken;

  if (!idx || !id) {
    return NextResponse.json({ isSuccess: false, message: "로그아웃 정보가 누락되었습니다." }, { status: 400 });
  }
  
  // 로그아웃 요청
  await signOut(idx, id);

  // 인증 관련 쿠키 삭제
  deleteAuthCookies();

  return NextResponse.redirect(new URL("/chatforyouio/front/auth/login", request.url));
}

// 인증 관련 쿠키 삭제
function deleteAuthCookies() {
  cookies().delete("AccessToken");
  cookies().delete("RefreshToken");
  cookies().delete("SessionToken");
}

