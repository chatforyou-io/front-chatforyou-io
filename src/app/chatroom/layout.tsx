"use client";

import OpenviduProvider from "@/src/contexts/OpenviduContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OpenviduProvider>
      {children}
    </OpenviduProvider>
  );
}
