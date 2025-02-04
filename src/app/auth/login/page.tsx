'use client';
 
import Link from "next/link";
import SocialLoginCard from "@/src/components/cards/SocialLoginCard";
import LoginForm from "@/src/components/forms/LoginForm";

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      <div className="flex flex-col justify-center items-center p-8 w-sm md:w-144 bg-white rounded-3xl">
        <h1 className="text-4xl font-semibold">로그인</h1>
        <div className="flex pt-4 space-x-2">
          <h3>계정이 없으신가요?</h3>
          <Link href="/auth/signup" className="text-primary font-semibold">가입하기</Link>
        </div>
        <LoginForm />
        <div className="relative flex justify-center items-center border-b border-gray-700 pt-8 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <SocialLoginCard />
      </div>
    </main>
  );
}
