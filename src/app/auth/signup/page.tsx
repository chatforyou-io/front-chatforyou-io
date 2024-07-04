'use client';

import LoginButtons from "@/src/components/auth/LoginButtons";
import SignUpForm from "@/src/components/auth/SignUpForm";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">가입</h1>
        <h1 className="text-gray-700 text-xl">계정 생성</h1>
      </div>
      <div className="w-full mt-4 px-20">
        <LoginButtons />
      </div>
      <div className="relative flex justify-center border-b border-gray-700 mt-12 w-full">
        <p className="absolute -bottom-3.5 px-2 bg-white text-gray-700 text-xl transition-colors duration-500">또는</p>
      </div>
      <div className="mt-8 px-8 w-full">
        <SignUpForm />
      </div>
      <div className='flex justify-center gap-4 mt-6 w-full'>
        <p className="text-xl">이미 계정이 있습니까?</p>
        <Link href="/" className="text-blue-500 text-xl">로그인</Link>
      </div>
    </>
  );
}
