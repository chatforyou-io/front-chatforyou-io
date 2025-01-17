'use client';
 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import LoginForm from "@/src/components/forms/LoginForm";
import "./style.css";

export default function Page() {
  const router = useRouter();

  const handleClick = async (provider: string) => {
    try {
      const response = await signIn(provider, { redirect: false });
      if (!response) {
        throw new Error('Unknown error');
      }
      if (!response.ok) {
        throw new Error(response.error || 'Unknown error');
      }

      // 로그인 성공 시 홈페이지로 리다이렉트
      router.push('/');
      
      // 페이지 데이터 새로고침
      router.refresh();
    } catch (error) {
      console.error(error?.toString() || 'Unknown error');
      return;
    }
  }

  return (
    <div className="flex-center size-full">
      <div className="flex-center p-12 w-144 bg-white rounded-3xl">
        <div className="flex-center">
          <h1 className="text-4xl font-semibold">로그인</h1>
          <div className="flex mt-2 space-x-2">
            <h3>계정이 없으신가요?</h3>
            <Link href="/auth/signup" className="text-primary font-semibold">가입하기</Link>
          </div>
        </div>
        <div className="mt-8 w-full">
          <LoginForm />
        </div>
        <div className="relative flex-center border-b border-gray-700 mt-12 w-full">
          <div className="absolute -bottom-3.5 px-4 bg-white">
            <span>또는 다음으로 로그인</span>
          </div>
        </div>
        <div className="flex justify-between space-x-4 w-full mt-12 px-20">
          <div className="flex-center">
            <button
              onClick={() => handleClick('kakao')}
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
              onClick={() => handleClick('naver')}
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
              onClick={() => handleClick('google')}
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
      </div>
    </div>
  );
}
