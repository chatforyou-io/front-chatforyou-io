"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SocialLoginCard from "@/src/components/cards/SocialLoginCard";
import EmailForm from "@/src/components/forms/EmailForm";
import SignUpForm from "@/src/components/forms/SignUpForm";
import ValidForm from "@/src/components/forms/ValidForm";
import { userCreate } from "@/src/libs/user";
import { useHandleRequestFail } from "@/src/hooks/useHandleRequestFail";

const STEPS = {
  EMAIL: 1,
  VALIDATION: 2,
  USER_INFO: 3,
};

export default function Page() {
  const router = useRouter();
  const handleRequestFail = useHandleRequestFail();
  
  const [step, setStep] = useState(STEPS.EMAIL);
  const [id, setId] = useState('');
  const [validCode, setValidCode] = useState('');

  const handleSubmitEmail = (id: string, mailCode: string) => {
    setId(id);
    setValidCode(mailCode);
    setStep(STEPS.VALIDATION);
  }

  const handleSubmitEmailValid = () => {
    setStep(STEPS.USER_INFO);
  }

  const handleSubmitUserInfo = async (name: string, pwd: string, confirmPwd: string) => {
    try {
      const data = await userCreate({ id, name, pwd, confirmPwd, usePwd: true});
      if (!data.isSuccess) throw new Error(handleRequestFail(data));
  
      router.push("/auth/login");
    } catch (error) {
      console.error("가입 요청 중 오류 발생:", error);
    }
  }

  const renderForm = () => {
    switch(step) {
      case STEPS.EMAIL:
        return <EmailForm onSubmit={handleSubmitEmail} />;
      case STEPS.VALIDATION:
        return <ValidForm validCode={validCode} onSubmit={handleSubmitEmailValid} />;
      case STEPS.USER_INFO:
        return <SignUpForm onSubmit={handleSubmitUserInfo} />;
      default:
        return null;
    }
  }

  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      <div className="flex flex-col justify-center items-center p-8 w-sm md:w-144 bg-white rounded-3xl">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-semibold">계정 생성</h1>
          <h3>환영합니다! 귀하의 정보를 입력하십시오.</h3>
        </div>
        <div className="pt-8 w-full">
          {renderForm()}
        </div>
        <div className="relative flex justify-center items-center border-b border-gray-700 pt-8 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <SocialLoginCard />
        <div className="flex justify-center gap-4 pt-4 w-full">
          <p>이미 계정이 있습니까?</p>
          <Link href="/" className="text-primary">로그인</Link>
        </div>
      </div>
    </main>
  );
}
