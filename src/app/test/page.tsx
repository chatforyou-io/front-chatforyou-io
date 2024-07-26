'use client';

import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">로그인</h1>
      </div>
      <div className="flex flex-col justify-center items-center mt-8 w-full">
        <div className="flex flex-col gap-4 border p-8 w-full max-w-xl rounded-3xl">
          <h3 className="text-gray-700 text-xl font-bold">DB 접속 테스트</h3>
          <Link href="/test/user" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">이동</Link>
        </div>
        <div className="flex flex-col gap-4 border mt-8 p-8 w-full max-w-xl rounded-3xl">
          <h3 className="text-gray-700 text-xl font-bold">Openvidu 테스트</h3>
          <Link href="/test/openvidu" className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">이동</Link>
        </div>
      </div>
    </>
  );
}
