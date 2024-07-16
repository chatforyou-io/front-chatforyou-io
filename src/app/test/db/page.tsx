'use client';

import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-12">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">DB 접속 테스트</h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-8 mt-8 w-full max-w-xl h-full">
        <Link href="/test/db/create" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">회원가입</Link>
        <Link href="/test/db/update" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">정보수정</Link>
        <Link href="/test/db/delete" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">회원탈퇴</Link>
      </div>
    </>
  );
}
