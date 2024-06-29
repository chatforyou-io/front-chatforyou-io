'use client';

import LoginButtons from "@/components/auth/LoginButtons";
import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <>
      <div className="mx-auto">
        <h1 className="text-gray-700 dark:text-gray-300 text-2xl">로그인</h1>
      </div>
      <div className="mt-12 px-8 w-full">
        <LoginForm />
      </div>
      <div className="relative flex justify-center border-b border-gray-700 dark:border-gray-300 mt-12 w-full">
        <p className="absolute -bottom-2.5 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-500">또는 다음으로 로그인</p>
      </div>
      <div className="w-full pt-12 px-20">
        <LoginButtons />
      </div>
    </>
  );
}
