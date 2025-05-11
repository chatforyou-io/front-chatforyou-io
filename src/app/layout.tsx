import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { SessionProvider } from "@/src/contexts/SessionContext";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

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
      <body className={notoSansKR.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
