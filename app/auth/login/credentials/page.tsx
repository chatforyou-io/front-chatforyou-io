'use client';

import Header from "@/components/Header";
import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-gray-200 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      <div className="flex flex-col items-center justify-center gap-4 border-x border-gray-400 mt-12 p-4 w-full max-w-xl h-full bg-white dark:bg-gray-700">
        <LoginForm />
      </div>
    </main>
  );
}
