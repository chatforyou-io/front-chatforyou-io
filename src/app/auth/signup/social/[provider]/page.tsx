"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import IconLoader from "@/public/images/icons/loader.svg";
import SocialSignUpForm from "@/src/components/forms/SocialSignUpForm";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  nickname: string;
}

const initialUserInfo: UserInfo = {
  id: "",
  email: "",
  name: "",
  nickname: "",
};

export default function Page({ params }: { params: { provider: string } }) {
  // 소셜 로그인 플랫폼
  const provider = params.provider;

  // 소셜 로그인 정보
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (!provider || !code || !state) {
      router.push("/auth/login");
      return;
    }

    const fetchSocialData = async () => {
      try {
        const response = await axios.post(`/chatforyouio/front/api/auth/social/${provider}/callback`, { code, state });

        // 소셜 로그인 성공 시 페이지 새로고침
        if (response.data.isSuccess) {
          window.location.reload();
          return;
        }

        // 소셜 로그인 정보 설정
        setUserInfo(response.data.userInfo);
        setIsLoading(false);
      } catch (error) {
        console.error(`소셜 로그인 중 오류 발생: ${error}`);
        router.push("/auth/login");
      }
    };

    fetchSocialData();
  }, [provider, code, state, router]);

  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      {isLoading ? (
        <IconLoader className="w-12 h-12 animate-spin" />
      ) : (
        <div className="flex flex-col justify-center items-center p-8 w-sm md:w-144 bg-white rounded-3xl">
          <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-semibold">계정 생성</h1>
          <h3>환영합니다! 귀하의 정보를 입력하십시오.</h3>
        </div>
        <div className="pt-8 w-full">
          <SocialSignUpForm id={userInfo.id} name={userInfo.name} nickName={userInfo.nickname} />
          </div>
        </div>
      )}
    </main>
  );
}
