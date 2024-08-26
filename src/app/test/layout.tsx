"use client";

import Header from "@/src/components/Header";
import TestSidebar from "@/src/components/sidebars/TestSidebars";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen bg-white">
      <Header />
      {children}
    </main>
  );
}