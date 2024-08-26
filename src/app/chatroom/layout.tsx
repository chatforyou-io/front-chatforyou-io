"use client";

import DimmedTemplate from "@/src/components/templates/DimmedTemplate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DimmedTemplate>
      {children}
    </DimmedTemplate>
  );
}
