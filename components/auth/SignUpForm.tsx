'use client';

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

export default function SignUpForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    
    let errorMessage = '';
    errorMessage = '가입하기';

    alert(errorMessage);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='w-full'
      >
        <input
          type='text'
          ref={usernameRef}
          className='border border-gray-700 dark:border-gray-300 mt-2 p-2 w-full text-gray-700 outline-none rounded'
          placeholder='이메일 주소' />
        <input
          type='password'
          ref={passwordRef}
          className='border border-gray-700 dark:border-gray-300 mt-2 p-2 w-full text-gray-700 outline-none rounded'
          placeholder='비밀번호' />
        <div className='flex justify-between mt-2 w-full'>
          <p className="hover:text-neutral-500 dark:hover:text-neutral-300 text-sm">이미 계정이 있습니까?</p>
          <Link href="/" className="hover:text-neutral-500 dark:hover:text-neutral-300 text-sm">로그인</Link>
        </div>
        <button className='w-full border border-gray-700 dark:border-gray-300 mt-2 p-2 font-bold hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded'>가입하기</button>
      </form>
    </>
  );
}