'use client';

import Link from "next/link";

export default function Page() {
  const states = [
    {
      title: '사용자 생성',
      link: '/test/user/create',
    },
    {
      title: '사용자 업데이트',
      link: '/test/user/update',
    },
    {
      title: '사용자 삭제',
      link: '/test/user/delete',
    },
    {
      title: '사용자 정보 조회',
      link: '/test/user/info',
    },
    {
      title: '사용자 중복 체크',
      link: '/test/user/checkNickname',
    },
    {
      title: '사용자 이메일 인증',
      link: '/test/user/validate',
    },
  ]
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-8">
        <h1 className="text-gray-700 text-[40px] font-semibold">사용자 API 테스트</h1>
      </div>
      <div className="flex flex-col items-center gap-8 mt-8 w-full h-full">
        {states.map((state, index) => (
          <div key={index} className="flex flex-col gap-4 border p-8 w-full max-w-lg rounded-3xl">
            <h3 className="text-gray-700 text-xl font-bold">{state.title}</h3>
            <Link href={state.link} className="w-full border px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">이동</Link>
          </div>
        ))}
      </div>
    </>
  );
}
