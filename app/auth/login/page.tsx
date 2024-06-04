'use client';

import Header from "@/components/Header";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const handleClick = async (provider: string) => {
    /* 소셜 로그인 로직 */
    signIn(provider, { callbackUrl: '/' });
  }

  return (
    <main className="flex flex-col items-center justify-center h-full bg-gray-200 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      <div className="flex flex-col items-center justify-center gap-4 border-x border-gray-400 mt-12 p-4 w-full max-w-xl h-full bg-white dark:bg-gray-700">
        <button
          onClick={() => handleClick('kakao')}
          className="relative flex justify-center items-center w-full border border-gray-400 p-4 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl">
          <div className="absolute left-4 flex justify-center items-center w-8 h-8 bg-yellow-400">
            <Image
              src="/images/icon-kakao.svg"
              alt="naver"
              width={24}
              height={24}
            />
          </div>
          <p className="w-full font-bold">카카오로 시작하기</p>
        </button>
        <button
          onClick={() => handleClick('naver')}
          className="relative flex justify-center items-center w-full border border-gray-400 p-4 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl">
          <div className="absolute left-4 flex justify-center items-center w-8 h-8 bg-green-600">
            <Image
              src="/images/icon-naver.svg"
              alt="naver"
              width={20}
              height={20}
            />
          </div>
          <p className="w-full font-bold">네이버로 시작하기</p>
        </button>
        <button
          onClick={() => handleClick('google')}
          className="relative flex justify-center items-center w-full border border-gray-400 p-4 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl">      
          <div className="absolute left-4 flex justify-center items-center w-8 h-8 bg-white">
            <Image
              src="/images/icon-google.svg"
              alt="naver"
              width={28}
              height={28}
            />
          </div>
          <p className="w-full font-bold">구글로 시작하기</p>
        </button>
        <Link
          href="/auth/login/credentials"
          className="flex justify-center items-center w-full border border-gray-400 p-4 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold rounded-xl"
        >이메일로 시작하기</Link>
      </div>
    </main>
  );
}
