'use client';
 
import Link from "next/link";
import { signIn } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import LoginForm from "@/src/components/forms/LoginForm";
import "./style.css";


export default function Page() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const handleClick = (provider: string) => {
    signIn(provider, { callbackUrl: `${basePath}/` });
  }

  return (
    <div className="flex-center w-full h-full">
      <div className="flex-center p-12 w-144 bg-white rounded-3xl">
        <div className="flex-center">
          <h1 className="text-4xl font-semibold">로그인</h1>
          <div className="flex mt-2 space-x-2">
            <h3>계정이 없으신가요?</h3>
            <Link href="/auth/signup" className="text-primary font-semibold">가입하기</Link>
          </div>
        </div>
        <div className="mt-8 w-full">
          <LoginForm />
        </div>
        <div className="relative flex-center border-b border-gray-700 mt-12 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <div className="flex justify-between space-x-4 w-full mt-12 px-20">
          <div className="flex-center">
            <button
              onClick={() => handleClick('kakao')}
              aria-label="kakao login button"
              className="social-login-button bg-yellow-400"
            >
              <CustomImage
                src="/images/icon-kakao.svg"
                alt="kakao login"
                width={36}
                height={36}
                priority
              />
            </button>
            <p className="mt-2">Kakao</p>
          </div>
          <div className="flex-center">
            <button
              onClick={() => handleClick('naver')}
              aria-label="naver login button"
              className="social-login-button bg-green-600"
            >
              <CustomImage
                src="/images/icon-naver.svg"
                alt="naver login"
                width={32}
                height={32}
                priority
              />
            </button>
            <p className="mt-2">Naver</p>
          </div>
          <div className="flex-center">
            <button
              onClick={() => handleClick('google')}
              aria-label="google login button"
              className="social-login-button bg-white"
            >
              <CustomImage
                src="/images/icon-google.svg"
                alt="google login"
                width={32}
                height={32}
                priority
              />
            </button>
            <p className="mt-2">Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}
