import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { signIn } from "@/src/libs/auth";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || '';
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export async function POST(request: NextRequest) {
  try {
    const { username, password }: Credentials = await request.json();

    // 아이디 입력 여부 체크
    if (!username) {
      return NextResponse.json({ message: "아이디를 입력해주세요." }, { status: 400 }); 
    }

    // 비밀번호 입력 여부 체크
    if (!password) {
      return NextResponse.json({ message: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    // 로그인 요청
    const { isSuccess, userData, accessToken: newAccessToken, refreshToken: newRefreshToken } = await signIn(username, password);

    // 로그인 실패 시
    if (!isSuccess) {
      return NextResponse.redirect(new URL(`${DOMAIN}/chatforyouio/front`, request.url));
    }

    // 사용자 데이터가 존재하지 않을 경우
    if (!userData) {
      return NextResponse.json({ message: "사용자 데이터가 존재하지 않습니다." }, { status: 400 });
    }

    // 토큰이 존재하지 않을 경우
    if (!newAccessToken || !newRefreshToken) {
      return NextResponse.json({ message: "토큰이 존재하지 않습니다." }, { status: 400 });
    }

    // session 토큰 생성
    const sessionToken = jwt.sign(userData, JWT_SECRET, { expiresIn: "1h" });

    // 인증 관련 쿠키 설정
    setAuthCookies(newAccessToken, newRefreshToken, sessionToken);

    return NextResponse.json({ isSuccess: true, message: "로그인 성공", userData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isSuccess: false, message: "로그인 실패" }, { status: 400 });
  }
}

// 인증 관련 쿠키 설정
function setAuthCookies(accessToken: string, refreshToken: string, sessionToken: string) {
  cookies().set("AccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookies().set("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookies().set("SessionToken", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}