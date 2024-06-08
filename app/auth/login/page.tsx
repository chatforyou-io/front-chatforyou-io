'use client';

import Header from "@/components/Header";
import LoginButtons from "@/components/auth/LoginButtons";
import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-700 transition-colors duration-500">
      <Header />
      <div className="flex flex-col items-center justify-center gap-20 mt-12 p-4 w-full max-w-md h-full">
        <div className="flex flex-col justify-center items-center gap-4 px-8 w-full">
          <h1 className="text-gray-700 dark:text-gray-300 text-2xl">로그인</h1>
          <LoginForm />
        </div>
        <div className="flex flex-col justify-center items-center gap-8 w-full mt-4">
          <div className="relative flex justify-center border-b border-gray-700 dark:border-gray-300 w-full">
            <p className="absolute -bottom-2.5 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-500">또는 다음으로 로그인</p>
          </div>
          <div className="w-full px-20">
            <LoginButtons />
          </div>
        </div>
      </div>
    </main>
  );
}
