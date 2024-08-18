'use client';

import Header from "@/src/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-20 h-screen bg-gray-200 transition-colors duration-500">
        {children}
      </main>
    </>
  );
}
