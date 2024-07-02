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
          className='border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full'
          placeholder='이메일 주소' />
        <input
          type='password'
          ref={passwordRef}
          className='border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full'
          placeholder='비밀번호' />
        <button className='w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white rounded-full'>가입하기</button>
      </form>
    </>
  );
}