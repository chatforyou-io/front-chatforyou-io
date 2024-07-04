'use client';

import Header from "@/src/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen bg-white transition-colors duration-500">
      <Header />
      <div className="flex flex-col items-center justify-center pt-20 mx-auto w-full max-w-xl h-full">
        {children}
      </div>
    </main>
  );
}
