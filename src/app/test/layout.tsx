'use client';

import Header from "@/src/components/Header";
import TestSidebar from "@/src/components/sidebars/TestSidebars";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen bg-white transition-colors duration-500">
      <Header />
      <div className="flex pt-20 w-full h-full bg-gray-200">
        {children}
      </div>
    </main>
  );
}