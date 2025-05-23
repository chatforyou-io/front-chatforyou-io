"use client";

import OpenViduProvider from "@/src/contexts/OpenViduContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OpenViduProvider>
      {children}
    </OpenViduProvider>
  );
}
