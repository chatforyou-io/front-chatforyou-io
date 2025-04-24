import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { socialSignIn } from "@/src/libs/auth";
import { cookies } from "next/headers";

// 소셜 플랫폼 타입
interface RequestParams {
  provider: "naver" | "kakao" | "google";
}

// 소셜 플랫폼별 설정
const config = {
  naver: {
    tokenUrl: "https://nid.naver.com/oauth2.0/token",
    userInfoUrl: "https://openapi.naver.com/v1/nid/me",
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? "",
    clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    redirectUri: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI ?? "",
    getUserInfo: (data: any) => ({
      id: data.response.id,
      email: data.response.email,
      name: data.response.name,
      nickname: data.response.nickname,
    }),
  },
  kakao: {
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    userInfoUrl: "https://kapi.kakao.com/v2/user/me",
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "",
    clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "",
    getUserInfo: (data: any) => ({
      id: data.id,
      email: data.kakao_account.email,
      name: data.kakao_account.profile.nickname,
      nickname: data.kakao_account.profile.nickname,
    }),
  },
  google: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "",
    getUserInfo: (data: any) => ({
      id: data.sub,
      email: data.email,
      name: data.name,
      nickname: "", // 구글은 닉네임 제공 안함
    }),
  },
};

export async function POST(request: NextRequest, { params }: { params: RequestParams }) {
  const { provider } = params;
  const { code, state } = await request.json();
  const providerConfig = config[provider];

  try {
    // 소셜 플랫폼에 토큰 요청
    const tokenResponse = await axios({
      url: providerConfig.tokenUrl,
      method: provider === "google" ? "POST" : "GET",
      [provider === "google" ? "data" : "params"]: {
        grant_type: "authorization_code",
        client_id: providerConfig.clientId,
        client_secret: providerConfig.clientSecret,
        redirect_uri: providerConfig.redirectUri,
        code,
        state,
      },
    });

    const providerAccessToken = tokenResponse.data.access_token;

    // 액세스 토큰으로 사용자 정보 요청
    const userInfoResponse = await axios.get(providerConfig.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${providerAccessToken}`,
      },
    });

    const userInfo = providerConfig.getUserInfo(userInfoResponse.data);
    
    // 사용자 정보를 이용해 로그인 요청
    const {
      isSuccess,
      userData,
      accessToken,
      refreshToken
    } = await socialSignIn(provider, userInfo.id, userInfo.email, userInfo.name, userInfo.nickname);

    // 로그인 실패 시 가입이 필요한 것으로 판단
    if (!isSuccess || !userData || !accessToken || !refreshToken) {
      return NextResponse.json({ isSuccess: false, userInfo, message: "가입이 필요합니다." }, { status: 200 });
    }
    
    // 세션 토큰 발급 (1시간 유효)
    const jwtSecret = process.env.JWT_SECRET ?? "";
    const sessionToken = jwt.sign(userData, jwtSecret, { expiresIn: "1h" });

    // 인증 관련 쿠키 설정
    setAuthCookies(accessToken, refreshToken, sessionToken);

    // 성공 응답 반환
    return NextResponse.json({ isSuccess: true, userData, accessToken, refreshToken, sessionToken }, { status: 200 });
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ isSuccess: false, message: error }, { status: 500 });
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
