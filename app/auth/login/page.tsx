'use client';

import Header from "@/components/Header";
import { signIn } from "next-auth/react";
import Image from "next/image";

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
          className="flex justify-center items-center w-full border border-gray-400 p-4 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 stroke-gray-700 dark:stroke-gray-200 fill-gray-700 dark:fill-gray-200 rounded-full"
          > 
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <p className="w-full font-bold">카카오로 시작하기</p>
        </button>
        <button
          onClick={() => handleClick('google')}
          className="flex justify-center items-center w-full border border-gray-400 p-4 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl">       
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 488 512"
            strokeWidth={1.5}
            stroke="currentColor"
            className="m-1 w-6 h-6 stroke-gray-700 dark:stroke-gray-200 fill-gray-700 dark:fill-gray-200 rounded-full"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          <p className="w-full font-bold">구글로 시작하기</p>
        </button>
      </div>
    </main>
  );
}
