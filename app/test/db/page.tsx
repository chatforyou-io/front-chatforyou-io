'use client';

import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">DB 접속 테스트</h1>
      </div>
      <div className="flex justify-center items-center gap-8 mt-8 w-full h-full">
        <div className="flex flex-col gap-4 border p-8 w-full max-w-lg rounded-3xl">
          <h3 className="text-gray-700 text-xl font-bold">회원 조회</h3>
          <Link href="/text/db" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">사용</Link>
        </div>
        <div className="flex flex-col gap-4 border p-8 w-full max-w-lg rounded-3xl">
          <h3 className="text-gray-700 text-xl font-bold">회원 조회</h3>
          <Link href="/text/db" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">사용</Link>
        </div>
        <div className="flex flex-col gap-4 border p-8 w-full max-w-lg rounded-3xl">
          <h3 className="text-gray-700 text-xl font-bold">회원 조회</h3>
          <Link href="/text/db" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">사용</Link>
        </div>
      </div>
    </>
  );
}
