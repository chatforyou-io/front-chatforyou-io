"use client";

import Header from "@/src/components/Header";
import OpenviduProvider from "@/src/contexts/OpenviduContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="size-full bg-gray-200">
      <Header />
      <div className="pt-20 size-full">
        <OpenviduProvider>
          {children}
        </OpenviduProvider>
      </div>
    </main>
  );
}
