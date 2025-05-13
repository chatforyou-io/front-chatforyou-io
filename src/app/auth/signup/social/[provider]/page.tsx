"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import IconLoader from "@/public/images/icons/loader.svg";

type SocialProviderType = "naver" | "kakao" | "google";

export default function Page({ params }: { params: { provider: SocialProviderType } }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 소셜 로그인 플랫폼
  const provider = params.provider;

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!provider || !code || !state) {
      router.push("/auth/login");
      return;
    }

    const fetchSocialData = async () => {
      try {
        await axios.post(`/chatforyouio/front/api/auth/social/${provider}/callback`, { code, state });

        // 소셜 로그인 시도 후 페이지 새로고침
        window.location.reload();
      } catch (error) {
        console.error(`소셜 로그인 중 오류 발생: ${error}`);
        router.push("/auth/login");
      }
    };

    fetchSocialData();
  }, [searchParams, router, provider]);

  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      <IconLoader className="w-12 h-12 animate-spin" />
    </main>
  );
}
