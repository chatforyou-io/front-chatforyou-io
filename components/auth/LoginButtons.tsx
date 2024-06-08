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
        <div className="flex justify-center items-center w-12 h-12 bg-yellow-400 shadow">
          <Image
            src="/images/icon-kakao.svg"
            alt="naver"
            width={32}
            height={32}
          />
        </div>
        <p>Kakao</p>
      </button>
      <button
        onClick={() => handleClick('naver')}
        className="flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center items-center w-12 h-12 bg-green-600 shadow">
          <Image
            src="/images/icon-naver.svg"
            alt="naver"
            width={28}
            height={28}
          />
        </div>
        <p>Naver</p>
      </button>
      <button
        onClick={() => handleClick('google')}
        className="flex flex-col justify-center items-center gap-2">      
        <div className="flex justify-center items-center w-12 h-12 bg-white shadow">
          <Image
            src="/images/icon-google.svg"
            alt="naver"
            width={36}
            height={36}
          />
        </div>
        <p>Google</p>
      </button>
    </div>
  );
}