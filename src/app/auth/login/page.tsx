'use client';
 
import GoogleButton from "@/src/components/buttons/GoogleButton";
import KakaoButton from "@/src/components/buttons/KakaoButton";
import NaverButton from "@/src/components/buttons/NaverButton";
import LoginForm from "@/src/components/forms/LoginForm";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const handleClick = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center p-12 w-full max-w-xl bg-white rounded-3xl">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-gray-700 text-[40px] font-semibold">로그인</h1>
          <div className="flex gap-2">
            <h3 className="text-gray-700 text-xl">계정이 없으신가요?</h3>
            <Link href="/chatforyouio/front/auth/signup" className="text-blue-500 text-xl font-semibold">가입하기</Link>
          </div>
        </div>
        <div className="mt-12 w-full">
          <LoginForm />
        </div>
        <div className="relative flex justify-center border-b border-gray-700 mt-16 w-full">
          <p className="absolute -bottom-3.5 px-4 bg-white text-gray-700 text-xl">또는 다음으로 로그인</p>
        </div>
        <div className="flex items-center justify-between gap-4 w-full mt-16 px-20">
          <div className="flex flex-col justify-center items-center gap-2">
            <KakaoButton onClick={() => handleClick('kakao')} />
            <p className="text-lg text-gray-700">Kakao</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <NaverButton onClick={() => handleClick('naver')} />
            <p className="text-lg text-gray-700">Naver</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <GoogleButton onClick={() => handleClick('google')} />
            <p className="text-lg text-gray-700">Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}
