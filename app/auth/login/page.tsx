'use client';
 
import LoginButtons from "@/components/auth/LoginButtons";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">로그인</h1>
        <div className="flex gap-2">
          <h3 className="text-gray-700 text-xl">계정이 없으신가요?</h3>
          <Link href="/auth/signup" className="text-blue-500 text-xl font-semibold">가입하기</Link>
        </div>
      </div>
      <div className="mt-12 px-8 w-full">
        <LoginForm />
      </div>
      <div className="relative flex justify-center border-b border-gray-700 mt-16 w-full">
        <p className="absolute -bottom-3.5 px-4 bg-white text-gray-700 text-xl transition-colors duration-500">또는 다음으로 로그인</p>
      </div>
      <div className="w-full mt-16 px-20">
        <LoginButtons />
      </div>
    </>
  );
}
