'use client';
 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginForm from "@/src/components/forms/LoginForm";
import IconKakao from "@/public/images/icon-kakao.svg";
import IconNaver from "@/public/images/icon-naver.svg";
import IconGoogle from "@/public/images/icon-google.svg";

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
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      <div className="flex justify-center items-center size-full">
        <div className="flex flex-col justify-center items-center p-12 w-sm md:w-144 bg-white rounded-3xl">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-semibold">로그인</h1>
            <div className="flex mt-2 space-x-2">
              <h3>계정이 없으신가요?</h3>
              <Link href="/auth/signup" className="text-primary font-semibold">가입하기</Link>
            </div>
          </div>
          <div className="mt-8 w-full">
            <LoginForm />
          </div>
          <div className="relative flex justify-center items-center border-b border-gray-700 mt-12 w-full">
            <div className="absolute -bottom-3.5 px-4 bg-white">
              <span>또는 다음으로 로그인</span>
            </div>
          </div>
          <div className="flex justify-between space-x-4 w-full mt-12 md:px-20">
            <div className="flex flex-col justify-center items-center">
              <button
                type="button"
                onClick={() => handleClick('kakao')}
                aria-label="kakao login button"
                className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-yellow-400">
                <IconKakao aria-label="kakao login" width={36} height={36} />
              </button>
              <p className="mt-2">Kakao</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                type="button"
                onClick={() => handleClick('naver')}
                aria-label="naver login button"
                className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-green-600 text-white">
                <IconNaver aria-label="naver login" width={32} height={32} />
              </button>
              <p className="mt-2">Naver</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                type="button"
                onClick={() => handleClick('google')}
                aria-label="google login button"
                className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-white">
                <IconGoogle aria-label="google login" width={48} height={48} />
              </button>
              <p className="mt-2">Google</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
