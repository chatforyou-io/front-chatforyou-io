"use client";

import PrimaryButton from '@/src/components/buttons/PrimaryButton';
import { userUpdate } from '@/src/lib/auth';

export default function Page() {
  const handleUpdate = async () => {
    // userUpdate();
  }
  
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-12">
        <h1 className="text-gray-700 text-[40px] font-semibold">회원탈퇴</h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-8 mt-8 w-full max-w-xl h-full">
        <div className='flex gap-8 w-full items-center'>
          <input type="text" name="idx" className="w-full border px-6 py-4 text-xl" placeholder="회원번호" />
          <input type="text" name="createDate" className="w-full border px-6 py-4 text-xl" placeholder="가입일" />
        </div>
        <input type="text" name="id" className="w-full border px-6 py-4 text-xl" placeholder="아이디" />
        <div className='flex gap-8 w-full items-center'>
          <input type="text" name="pwd" className="w-full border px-6 py-4 text-xl" placeholder="비밀번호" />
          <label htmlFor="usePwd" className='flex justify-between gap-8 w-72 text-xl'>
            비밀번호 사용
            <input type="checkbox" name="usePwd" className="border" placeholder="비밀번호" />
          </label>
        </div>
        <input type="text" name="name" className="w-full border px-6 py-4 text-xl" placeholder="회원명" />
        <input type="text" name="nickName" className="w-full border px-6 py-4 text-xl" placeholder="닉네임" />
      </div>
      <div className="flex flex-col justify-center items-center gap-8 mt-8 w-full max-w-xl h-full">
        <PrimaryButton type="button" onClick={handleUpdate} label={"정보수정"} />
      </div>
    </>
  );
}
