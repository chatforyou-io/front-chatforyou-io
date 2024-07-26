'use client';

import Header from "@/src/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen bg-white transition-colors duration-500">
      <Header />
      <div className="flex flex-col items-center pt-20 mx-auto w-full h-full overflow-y-scroll">
        {children}
      </div>
    </main>
  );
}