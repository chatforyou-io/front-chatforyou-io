'use client';

import LoginButtons from '@/src/components/auth/LoginButtons';
import SignUpForm from '@/src/components/molecules/Form/SignUpForm';

export default function Page() {  
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-12">
        <h1 className="text-gray-700 text-[40px] font-semibold">회원가입</h1>
      </div>
      <div className="mt-8 px-20 w-full max-w-xl">
        <LoginButtons />
      </div>
      <div className="mt-8 px-8 w-full max-w-xl">
        <SignUpForm />
      </div>
    </>
  );
}
