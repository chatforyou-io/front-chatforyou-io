import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/src/contexts/NextAuthContext";
import Header from "@/src/components/items/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatForYou.io",
  description: "Simple WebRTC Chat Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
