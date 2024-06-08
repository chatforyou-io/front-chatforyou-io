'use client';

import { signIn } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";

export default function LoginForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
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

      setErrorMessage(errorMessage);
      return;
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-6 justify-center w-full text-gray-700 dark:text-gray-300 rounded'
      >
        <div className='flex flex-col items-center gap-2 w-full'>
          <input
            type='text'
            ref={usernameRef}
            className='border border-gray-700 dark:border-gray-300 p-2 w-full text-gray-700 outline-none rounded'
            placeholder='이메일 주소' />
          <input
            type='password'
            ref={passwordRef}
            className='border border-gray-700 dark:border-gray-300 p-2 w-full text-gray-700 outline-none rounded'
            placeholder='비밀번호' />
        </div>
        <div className="flex flex-col gap-2">
          <p className="hover:text-neutral-500 dark:hover:text-neutral-300 text-sm">비밀번호를 잊으셨나요?</p>
          <button className='w-full border border-gray-700 dark:border-gray-300 p-2 font-bold hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded'>로그인</button>
        </div>
      </form>
    </>
  );
}

const LoginAlert = (errorMessage: string) => {
  return (
    <div
      className='border border-gray-700 dark:border-gray-300 bg-white dark:bg-black text-black dark:text-white p-4 w-96 rounded'
      role='alert'
    >{errorMessage}</div>
  );
}