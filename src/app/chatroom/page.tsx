"use client";

import ChatRooms from "@/src/components/ChatRooms";
import Header from "@/src/components/Header";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-white">
      <Header />
      <div className="flex flex-col mt-20 p-4 w-full max-w-xl h-full">
        <div className="w-full h-full">
          <ChatRooms />
        </div>
        <div className="flex justify-end w-full h-8">
          <Link
            href="/"
            className="flex gap-2 items-center h-8 text-gray-900 font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span>메인으로</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
