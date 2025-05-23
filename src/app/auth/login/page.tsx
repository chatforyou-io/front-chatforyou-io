'use client';
 
import Link from "next/link";
import SocialLoginCard from "@/src/components/cards/SocialLoginCard";
import LoginForm from "@/src/components/forms/LoginForm";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center size-full bg-white">
      <main className="flex flex-col justify-center items-center p-8 w-md md:w-144 bg-white rounded-2xl">
        <h1 className="text-4xl text-primary font-semibold">ChatForYou.io</h1>
        <LoginForm />
        <div className="relative flex justify-center items-center border-b border-gray-700 pt-8 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <SocialLoginCard />
        <div className="flex gap-2 pt-4">
          <h3>계정이 없으신가요?</h3>
          <Link href="/auth/signup" className="text-primary font-semibold">가입하기</Link>
        </div>
      </main>
    </div>
  );
}
