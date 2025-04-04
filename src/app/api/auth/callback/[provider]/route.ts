import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { socialSignIn } from "@/src/libs/auth";
import { cookies } from "next/headers";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

interface RequestParams {
  provider: string;
}

export async function GET(request: NextRequest, { params }: { params: RequestParams }) {
  const { provider } = params;

  // URL에서 "code" 파라미터 추출
  const { searchParams } = request.nextUrl;

  switch (provider) {
    case "naver":
      const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
      const naverClientSecret = process.env.NAVER_CLIENT_SECRET;
      const naverRedirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
      const naverCode = searchParams.get("code");
      const naverState = searchParams.get("state");

      // 토큰 발급
      const { data: naverTokenInfo } = await axios.get("https://nid.naver.com/oauth2.0/token", {
        params: {
          grant_type: "authorization_code",
          client_id: naverClientId,
          client_secret: naverClientSecret,
          redirect_uri: naverRedirectUri,
          code: naverCode,
          state: naverState,
        },
      });

      // 사용자 정보 조회
      const { data: naverUserInfo } = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${naverTokenInfo.access_token}`,
        },
      });

      // 로그인 요청
      const { isSuccess: naverIsSuccess, userData: naverUserData, accessToken: naverAccessToken, refreshToken: naverRefreshToken } = await socialSignIn(provider, naverUserInfo.response.id, naverUserInfo.response.email, naverUserInfo.response.name, naverUserInfo.response.nickname);

      // 로그인 실패 시
      if (!naverIsSuccess) {
        return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 400 });
      }

      // 사용자 데이터가 존재하지 않을 경우
      if (!naverUserData) {
        return NextResponse.json({ error: "사용자 데이터가 존재하지 않습니다." }, { status: 400 });
      }

      // 토큰이 존재하지 않을 경우
      if (!naverAccessToken || !naverRefreshToken) {
        return NextResponse.json({ error: "토큰이 존재하지 않습니다." }, { status: 400 });
      }

      // session 토큰 생성
      const naverSessionToken = jwt.sign(naverUserData, JWT_SECRET, { expiresIn: "1h" });

      // 쿠키 설정
      setAuthCookies(naverAccessToken, naverRefreshToken, naverSessionToken);

      return NextResponse.redirect(new URL('/chatforyouio/front', request.url));
    case "kakao":
      const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
      const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET;
      const kakaoRedirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
      const kakaoCode = searchParams.get("code");
      const kakaoState = searchParams.get("state");

      // 토큰 발급
      const { data: kakaoTokenInfo } = await axios.get("https://kauth.kakao.com/oauth/token", {
        params: {
          grant_type: "authorization_code",
          client_id: kakaoClientId,
          client_secret: kakaoClientSecret,
          redirect_uri: kakaoRedirectUri,
          code: kakaoCode,
          state: kakaoState,
        },
      });

      // 사용자 정보 조회
      const { data: kakaoUserInfo } = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${kakaoTokenInfo.access_token}`,
        },
      });

      // 로그인 요청
      const { isSuccess: kakaoIsSuccess, userData: kakaoUserData, accessToken: kakaoAccessToken, refreshToken: kakaoRefreshToken } = await socialSignIn(provider, kakaoUserInfo.id, kakaoUserInfo.kakao_account.email, kakaoUserInfo.kakao_account.profile.nickname);

      // 로그인 실패 시
      if (!kakaoIsSuccess) {
        return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 400 });
      }

      // 사용자 데이터가 존재하지 않을 경우
      if (!kakaoUserData) {
        return NextResponse.json({ error: "사용자 데이터가 존재하지 않습니다." }, { status: 400 });
      }

      // 토큰이 존재하지 않을 경우
      if (!kakaoAccessToken || !kakaoRefreshToken) {
        return NextResponse.json({ error: "토큰이 존재하지 않습니다." }, { status: 400 });
      }

      // session 토큰 생성
      const kakaoSessionToken = jwt.sign(kakaoUserData, JWT_SECRET, { expiresIn: "1h" });

      // 쿠키 설정
      setAuthCookies(kakaoAccessToken, kakaoRefreshToken, kakaoSessionToken);

      return NextResponse.redirect(new URL('/chatforyouio/front', request.url));
    case "google":
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const googleRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
      const googleCode = searchParams.get("code");
      const googleState = searchParams.get("state");

      // 토큰 발급  
      const { data: googleTokenInfo } = await axios.post("https://oauth2.googleapis.com/token", {
        grant_type: "authorization_code",
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        code: googleCode,
        state: googleState,
      });

      // 사용자 정보 조회
      const { data: googleUserInfo } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleTokenInfo.access_token}`,
        },
      });

      // 로그인 요청
      const { isSuccess: googleIsSuccess, userData: googleUserData, accessToken: googleAccessToken, refreshToken: googleRefreshToken } = await socialSignIn(provider, googleUserInfo.sub, googleUserInfo.email, googleUserInfo.name, "");

      // 로그인 실패 시
      if (!googleIsSuccess) {
        return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 400 });
      }

      // 사용자 데이터가 존재하지 않을 경우
      if (!googleUserData) {
        return NextResponse.json({ error: "사용자 데이터가 존재하지 않습니다." }, { status: 400 });
      }

      // 토큰이 존재하지 않을 경우
      if (!googleAccessToken || !googleRefreshToken) {
        return NextResponse.json({ error: "토큰이 존재하지 않습니다." }, { status: 400 });
      }

      // session 토큰 생성
      if (!googleUserData || !googleAccessToken || !googleRefreshToken) {
        return NextResponse.json({ error: "토큰이 존재하지 않습니다." }, { status: 400 });
      }

      const googleSessionToken = jwt.sign(googleUserData, JWT_SECRET, { expiresIn: "1h" });

      // 쿠키 설정
      setAuthCookies(googleAccessToken, googleRefreshToken, googleSessionToken);

      return NextResponse.redirect(new URL('/chatforyouio/front', request.url));
  }    
}

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
