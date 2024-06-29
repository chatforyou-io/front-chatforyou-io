'use client';

import LoginButtons from "@/components/auth/LoginButtons";
import SignUpForm from "@/components/auth/SignUpForm";

export default function Page() {
  return (
    <>
      <div className="mx-auto">
        <h1 className="text-gray-700 dark:text-gray-300 text-2xl">가입</h1>
      </div>
      <div className="mt-12 mx-auto">
        <h1 className="text-gray-700 dark:text-gray-300">계정 생성</h1>
      </div>
      <div className="w-full mt-12 px-20">
        <LoginButtons />
      </div>
      <div className="relative flex justify-center border-b border-gray-700 mt-12 dark:border-gray-300 w-full">
        <p className="absolute -bottom-2.5 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-500">또는</p>
      </div>
      <div className="mt-12 px-8 w-full">
        <SignUpForm />
      </div>
    </>
  );
}
