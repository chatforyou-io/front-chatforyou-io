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
    <div className="flex flex-col justify-center items-center size-full bg-white">
      <main className="flex flex-col justify-center items-center p-8 w-md md:w-144 bg-white rounded-2xl">
        <h1 className="text-4xl text-primary font-semibold">ChatForYou.io</h1>
        {renderForm()}
        <div className="relative flex justify-center items-center border-b border-gray-700 pt-8 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <SocialLoginCard />
        <div className="flex gap-2 pt-4">
          <p>이미 계정이 있습니까?</p>
          <Link href="/" className="text-primary font-semibold">로그인</Link>
        </div>
      </main>
    </div>
  );
}
