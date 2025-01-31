"use client";

import Header from "@/src/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="size-full bg-gray-200">
      <Header />
      <div className="pt-20 size-full">
        {children}
      </div>
    </main>
  );
}
