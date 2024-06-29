'use client';

import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen bg-white dark:bg-gray-700 transition-colors duration-500">
      <Header />
      <div className="flex flex-col items-center justify-center mt-12 mx-auto w-full max-w-md h-full">
        {children}
      </div>
    </main>
  );
}
