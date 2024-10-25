"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import EmailForm from "@/src/components/forms/EmailForm";
import UserInfoForm from "@/src/components/forms/UserInfoForm";
import ValidForm from "@/src/components/forms/ValidForm";
import { userCreate } from "@/src/libs/auth";
import "./style.css";

const STEPS = {
  EMAIL: 1,
  VALIDATION: 2,
  USER_INFO: 3,
};

export default function Page() {
  const router = useRouter();
  
  const [step, setStep] = useState(STEPS.EMAIL);
  const [id, setId] = useState('');
  const [validCode, setValidCode] = useState('');
  
  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  }

  const handleSubmitEmail = (id: string, mailCode: string) => {
    setId(id);
    setValidCode(mailCode);
    setStep(STEPS.VALIDATION);
  }

  const handleSubmitEmailValid = () => {
    setStep(STEPS.USER_INFO);
  }

  const handleSubmitUserInfo = async (name: string, pwd: string, confirmPwd: string) => {
    const user: User = { id, name, pwd, confirmPwd, usePwd: true};
    
    try {
      const data = await userCreate(user);
      if (!data.isSuccess) throw new Error('User creation failed');
  
      alert('가입에 성공하였습니다.');
      router.push("/auth/login");
    } catch (error) {
      console.error('가입 요청 중 오류 발생:', error);
      alert('가입 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  }

  return (
    <div className="flex-center w-full h-full">
      <div className="flex-center p-12 w-144 bg-white rounded-3xl">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-[40px] leading-10 font-semibold">계정 생성</h1>
          <h1 className="text-[20px[ leading-5">환영합니다! 귀하의 자세한 정보를 입력하십시오.</h1>
        </div>
        <div className="mt-8 px-8 w-full">
          {step === 1 && <EmailForm onSubmit={handleSubmitEmail} />}
          {step === 2 && <ValidForm validCode={validCode} onSubmit={handleSubmitEmailValid} />}
          {step === 3 && <UserInfoForm onSubmit={handleSubmitUserInfo} />}
        </div>
        <div className="relative flex-center border-b border-gray-700 mt-12 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <div className="flex justify-between space-x-4 w-full mt-12 px-20">
          <div className="flex-center">
            <button
              onClick={() => handleSocialLogin('kakao')}
              aria-label="kakao login button"
              className="social-login-button bg-yellow-400"
            >
              <CustomImage
                src="/images/icon-kakao.svg"
                alt="kakao login"
                width={36}
                height={36}
                priority
              />
            </button>
            <p className="mt-2">Kakao</p>
          </div>
          <div className="flex-center">
            <button
              onClick={() => handleSocialLogin('naver')}
              aria-label="naver login button"
              className="social-login-button bg-green-600"
            >
              <CustomImage
                src="/images/icon-naver.svg"
                alt="naver login"
                width={32}
                height={32}
                priority
              />
            </button>
            <p className="mt-2">Naver</p>
          </div>
          <div className="flex-center">
            <button
              onClick={() => handleSocialLogin('google')}
              aria-label="google login button"
              className="social-login-button bg-white"
            >
              <CustomImage
                src="/images/icon-google.svg"
                alt="google login"
                width={32}
                height={32}
                priority
              />
            </button>
            <p className="mt-2">Google</p>
          </div>
        </div>
        <div className='flex justify-center gap-4 mt-6 w-full'>
          <p>이미 계정이 있습니까?</p>
          <Link href="/" className="text-primary">로그인</Link>
        </div>
      </div>
    </div>
  );
}
