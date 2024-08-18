'use client';

import GoogleButton from "@/src/components/buttons/GoogleButton";
import KakaoButton from "@/src/components/buttons/KakaoButton";
import NaverButton from "@/src/components/buttons/NaverButton";
import EmailForm from "@/src/components/forms/EmailForm";
import ValidForm from "@/src/components/forms/ValidForm";
import UserInfoForm from "@/src/components/forms/UserInfoForm";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [step, setStep] = useState<number>(1);
  const [id, setId] = useState<string>('');
  const [validCode, setValidCode] = useState<string>('');
  const router = useRouter();
  
  const handleClick = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  }

  const handleSubmitEmail = (id: string, mailCode: string) => {
    setId(id);
    setValidCode(mailCode);

    setStep(2);
  }

  const handleSubmitEmailValid = () => {
    setStep(3);
  }

  const handleSubmitUserInfo = async (name: string, pwd: string, confirmPwd: string) => {
    const user: User = {
      idx: 0,
      name: name,
      id: id,
      pwd: btoa(pwd),
      confirmPwd: btoa(confirmPwd),
      use_pwd: true,
      nick_name: '',
      create_date: ''
    };
    
    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        // HTTP 상태 코드가 2xx가 아닌 경우
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
  
      const data = await response.json();
  
      if (!data.isSuccess) {
        alert('가입에 실패하였습니다.');
        return;
      }
  
      alert('가입에 성공하였습니다.');
      router.push('/auth/login');
    } catch (error) {
      console.error('가입 요청 중 오류 발생:', error);
      alert('가입 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-gray-700 text-[40px] leading-10 font-semibold">계정 생성</h1>
        <h1 className="text-gray-700 text-[20px[ leading-5">환영합니다! 귀하의 자세한 정보를 입력하십시오.</h1>
      </div>
      <div className="flex items-center justify-between gap-4 w-full mt-16 px-20">
        <div className="flex flex-col justify-center items-center gap-2">
          <KakaoButton onClick={() => handleClick('kakao')} />
          <p className="text-lg text-gray-700">Kakao</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <NaverButton onClick={() => handleClick('naver')} />
          <p className="text-lg text-gray-700">Naver</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <GoogleButton onClick={() => handleClick('google')} />
          <p className="text-lg text-gray-700">Google</p>
        </div>
      </div>
      <div className="relative flex justify-center border-b border-gray-700 mt-12 w-full">
        <p className="absolute -bottom-3.5 px-2 bg-white text-gray-700 text-xl transition-colors duration-500">또는 다음으로 계정 생성</p>
      </div>
      <div className="mt-10 px-8 w-full">
        {step === 1 && <EmailForm onSubmit={handleSubmitEmail} />}
        {step === 2 && <ValidForm validCode={validCode} onSubmit={handleSubmitEmailValid} />}
        {step === 3 && <UserInfoForm onSubmit={handleSubmitUserInfo} />}
      </div>
      <div className='flex justify-center gap-4 mt-6 w-full'>
        <p className="text-xl">이미 계정이 있습니까?</p>
        <Link href="/" className="text-blue-500 text-xl">로그인</Link>
      </div>
    </>
  );
}
