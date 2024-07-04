'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginButtons() {
  const handleClick = async (provider: string) => {
    /* 소셜 로그인 로직 */
    signIn(provider, { callbackUrl: '/' });
  }

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <button
        onClick={() => handleClick('kakao')}
        className="flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center items-center w-16 h-16 bg-yellow-400 shadow rounded-2xl">
          <Image
            src="/images/icon-kakao.svg"
            alt="naver"
            width={36}
            height={36}
          />
        </div>
        <p className="text-lg text-gray-700">Kakao</p>
      </button>
      <button
        onClick={() => handleClick('naver')}
        className="flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center items-center w-16 h-16 bg-green-600 shadow rounded-2xl">
          <Image
            src="/images/icon-naver.svg"
            alt="naver"
            width={32}
            height={32}
          />
        </div>
        <p className="text-lg text-gray-700">Naver</p>
      </button>
      <button
        onClick={() => handleClick('google')}
        className="flex flex-col justify-center items-center gap-2">      
        <div className="flex justify-center items-center w-16 h-16 bg-white shadow rounded-2xl">
          <Image
            src="/images/icon-google.svg"
            alt="naver"
            width={40}
            height={40}
          />
        </div>
        <p className="text-lg text-gray-700">Google</p>
      </button>
    </div>
  );
}