import { NextRequest, NextResponse } from "next/server";

// 소셜 플랫폼 타입
type SocialProviderType = "naver" | "kakao" | "google";

type SocialProviderConfig = {
  url: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
}

// 소셜 플랫폼별 설정
const socialProviderConfig: Record<SocialProviderType, SocialProviderConfig> = {
  naver: {
    url: "https://nid.naver.com/oauth2.0/authorize",
    clientId: process.env.NAVER_CLIENT_ID ?? "",
    redirectUri: process.env.NAVER_REDIRECT_URI ?? "",
    state: process.env.NAVER_STATE ?? "",
    scope: "", // 네이버는 스코프 설정 안함
  },
  kakao: {
    url: "https://kauth.kakao.com/oauth/authorize",
    clientId: process.env.KAKAO_CLIENT_ID ?? "",
    redirectUri: process.env.KAKAO_REDIRECT_URI ?? "",
    state: process.env.KAKAO_STATE ?? "",
    scope: "", // 카카오는 스코프 설정 안함
  },
  google: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
    state: process.env.GOOGLE_STATE ?? "",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
  },
};

export async function GET(_request: NextRequest, { params }: { params: { provider: SocialProviderType } }) {
  const provider = params.provider;
  const { url, clientId, redirectUri, state, scope } = socialProviderConfig[provider];

  const redirectUrl = new URL(url);
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("client_id", clientId);
  redirectUrl.searchParams.set("redirect_uri", redirectUri);
  redirectUrl.searchParams.set("state", state);
  redirectUrl.searchParams.set("scope", scope);

  return NextResponse.redirect(redirectUrl.toString());
}