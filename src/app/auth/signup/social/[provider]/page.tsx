"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { userCreate } from "@/src/libs/user";
import IconLoader from "@/public/images/icons/loader.svg";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import InputWithError from "@/src/components/items/InputWithError";

interface UserInfo {
  id: string;
  email?: string;
  name: string;
  nickname?: string;
}

interface SignUpErrors {
  name?: string;
  password?: string;
  confirmPwd?: string;
};

const initialUserInfo: UserInfo = {
  id: "",
  email: "",
  name: "",
  nickname: "",
};

export default function Page({ params }: { params: { provider: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleRequestFail = useHandleRequestFail();

  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<SignUpErrors>({});

  useEffect(() => {
    const provider = params.provider;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
  
    if (!code || !state) {
      router.push("/auth/login");
      return;
    }

    const fetchSocialData = async () => {
      try {
        const response = await axios.post(`/chatforyouio/front/api/auth/callback/${provider}`, { code, state });

        const { data } = response;

        if (data.isSuccess) {
          router.push("/");
        } else {
          setUserInfo(data.userInfo);
          setIsLoading(false);
        }
      } catch (error) {
        handleRequestFail(error);
        router.push("/auth/login");
      }
    };

    fetchSocialData();
  }, [params.provider, searchParams, router, handleRequestFail]);

  const validate = (password: string, confirmPwd: string): boolean => {
    const newErrors: SignUpErrors = {};

    if (!password) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!confirmPwd) {
      newErrors.confirmPwd = "비밀번호 확인을 입력하세요.";
    } else if (confirmPwd !== password) {
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const pwd = formData.get("pwd") as string;
    const confirmPwd = formData.get("confirmPwd") as string;

    if (!validate(pwd, confirmPwd)) return;

    const { id, name } = userInfo;

    try {
      const data = await userCreate({ id, name, pwd, confirmPwd, usePwd: true});
      if (!data.isSuccess) throw new Error(handleRequestFail(data));
  
      router.push("/auth/login");
    } catch (error) {
      console.error("가입 요청 중 오류 발생:", error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      {isLoading ? (
        <IconLoader className="w-12 h-12 animate-spin" />
      ) : (
        <div className="flex flex-col justify-center items-center p-8 w-sm md:w-144 bg-white rounded-3xl">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-4xl font-semibold">계정 생성</h1>
            <h3>환영합니다! 귀하의 정보를 입력하십시오.</h3>
          </div>
          <div className="pt-8 w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input type="text" name="name" className="border px-4 h-16 w-full bg-white rounded-full" aria-label="이름" defaultValue={userInfo.name} readOnly />
                <InputWithError type="password" name="pwd" placeholder="비밀번호" label="비밀번호" errorMessage={errors.password} />
                <InputWithError type="password" name="confirmPwd" placeholder="비밀번호 확인" label="비밀번호 확인" errorMessage={errors.confirmPwd} />
              </div>
              <div className="pt-4">
                <button type="submit" className="border p-4 w-full h-16 bg-primary text-white rounded-full">계속</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
