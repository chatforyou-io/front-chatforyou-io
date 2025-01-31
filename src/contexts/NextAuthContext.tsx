"use client";

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ children }: { children: ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <SessionProvider basePath={`${basePath}/api/auth`}>
      {children}
    </SessionProvider>
  );
}