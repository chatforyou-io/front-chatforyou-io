import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";
import jwt from "jsonwebtoken";
import { socialSignIn } from "@/src/libs/auth";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || '';

interface RequestParams {
  provider: string;
}

export async function GET(request: NextRequest, { params }: { params: RequestParams }) {
  const { provider } = params;

  // URL에서 'code' 파라미터 추출
  const { searchParams } = new URL(request.url);

  switch (provider) {
    case "naver":
      const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
      const naverClientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
      const naverCode = searchParams.get('code');
      const naverState = searchParams.get('state');

      // 토큰 발급
      const { data: tokenInfo } = await axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
          grant_type: 'authorization_code',
          client_id: naverClientId,
          client_secret: naverClientSecret,
          code: naverCode,
          state: naverState,
        },
      });

      // 사용자 정보 조회
      const { data: userInfo } = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
        },
      });
      if (userInfo.resultcode !== '00') {
        throw new Error(userInfo.message);
      }

      // 로그인 요청
      const { isSuccess, userData, accessToken, refreshToken } = await socialSignIn(provider, userInfo.response.id, userInfo.response.email, userInfo.response.name, userInfo.response.nickname);

      console.log(isSuccess, userData, accessToken, refreshToken);

      // 로그인 실패 시
      if (!isSuccess) {
        return NextResponse.json({ error: '로그인에 실패했습니다.' }, { status: 400 });
      }

      // 사용자 데이터가 존재하지 않을 경우
      if (!userData) {
        return NextResponse.json({ error: '사용자 데이터가 존재하지 않습니다.' }, { status: 400 });
      }

      // 토큰이 존재하지 않을 경우
      if (!accessToken || !refreshToken) {
        return NextResponse.json({ error: '토큰이 존재하지 않습니다.' }, { status: 400 });
      }

      // session 토큰 생성
      const sessionToken = jwt.sign(userData, JWT_SECRET, { expiresIn: "1h" });

      // AccessToken 쿠키 설정
      cookies().set("AccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // RefreshToken 쿠키 설정
      cookies().set("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // SessionToken 쿠키 설정
      cookies().set("SessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return NextResponse.redirect(new URL('/', request.url));
    case "kakao":
      break;
    case "google":
      break;
  }    
}
