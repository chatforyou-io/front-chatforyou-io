'use client';

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

export default function LoginForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const response = await signIn('credentials', { redirect: false, username, password });
    
    if (response && !response.ok) {
      let errorMessage = '';
      if (response.error === 'CredentialsSignin') {
        errorMessage = '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.';
      } else if (response.error === 'OAuthSignin') {
        errorMessage = '소셜 로그인에 실패했습니다. 다른 계정으로 시도해 보세요.';
      } else {
        errorMessage = '알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해 주세요.';
      }

      alert(errorMessage);
      return;
    }
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
        <div className='mt-8 w-full'>
          <p className="text-blue-500 text-xl font-semibold">비밀번호를 잊으셨나요?</p>
        </div>
        <button className='w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white rounded-full'>로그인</button>
      </form>
    </>
  );
}