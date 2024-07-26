'use client';

import SignUpForm from "@/src/components/auth/SignUpForm";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-8">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">사용자 생성</h1>
      </div>
      <div className="flex flex-col items-center gap-8 mt-8 w-full max-w-xl h-full">
        <SignUpForm />
      </div>
    </>
  );
}
