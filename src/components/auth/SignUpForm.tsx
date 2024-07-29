'use client';

import { FormEvent, useRef, useState } from "react";

export default function SignUpForm() {
  const [confirmState, setConfirmState] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const confirmPwdRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!confirmState) {
      alert('중복확인을 해주세요.');
      return;
    }

    const id = idRef.current?.value;
    const pwd = pwdRef.current?.value;
    const confirmpwd = confirmPwdRef.current?.value;
    
    let errorMessage = '';
    errorMessage = '가입하기';

    alert(errorMessage);
  }

  const handleValidate = async () => {
    const id = idRef.current?.value;
    if (!id) {
      alert('이메일 주소를 입력해주세요.');
      return;
    }

    const data = await fetch(`/api/user/validate?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());

    if (!data.isSuccess) {
      alert('이미 등록된 이메일 주소입니다.');
      return;
    }

    alert('사용 가능한 이메일 주소입니다.');
    setConfirmState(true);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='w-full'
      >
        <input
          type='text'
          ref={idRef}
          className='border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full'
          placeholder='이메일 주소' />
        <button
          type="button"
          onClick={handleValidate}
          className='w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white rounded-full'>중복확인</button>
        <input
          type='pwd'
          ref={pwdRef}
          className='border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full'
          placeholder='비밀번호' />
        <input
          type='pwd'
          ref={confirmPwdRef}
          className='border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full'
          placeholder='비밀번호확인' />
        <button className='w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white rounded-full'>가입하기</button>
      </form>
    </>
  );
}