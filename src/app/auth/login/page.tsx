'use client';
 
import GoogleButton from "@/src/components/buttons/GoogleButton";
import KakaoButton from "@/src/components/buttons/KakaoButton";
import NaverButton from "@/src/components/buttons/NaverButton";
import LoginForm from "@/src/components/forms/LoginForm";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  
  const handleSubmit = async (username: string, password: string) => {
    // Base64 인코딩
    password = btoa(password);

    try {
      const response = await signIn('credentials', { redirect: false, username, password });
      if (!response) {
        throw new Error('Unknown error');
      }
      if (!response.ok) {
        throw new Error(response.error || 'Unknown error');
      }
      
      // 로그인 성공 시 홈페이지로 리다이렉트
      router.replace('/');
      
      // 페이지 데이터 새로고침
      router.refresh();
    } catch (error) {
      handleSubmitError(error?.toString() || 'Unknown error');
      return;
    }
  };
  
  const handleSubmitError = (error: string) => {
    let errorMessage = '알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해 주세요.';

    switch (error) {
      case 'CredentialsSignin': 
        errorMessage = '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.';
        break;
      case 'OAuthSignin': 
        errorMessage = '소셜 로그인에 실패했습니다. 다른 계정으로 시도해 보세요.';
        break;
    }

    alert(errorMessage);
  };

  const handleClick = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-700 text-[40px] font-semibold">로그인</h1>
        <div className="flex gap-2">
          <h3 className="text-gray-700 text-xl">계정이 없으신가요?</h3>
          <Link href="/auth/signup" className="text-blue-500 text-xl font-semibold">가입하기</Link>
        </div>
      </div>
      <div className="mt-12 px-8 w-full">
        <LoginForm onSubmit={handleSubmit} />
      </div>
      <div className="relative flex justify-center border-b border-gray-700 mt-16 w-full">
        <p className="absolute -bottom-3.5 px-4 bg-white text-gray-700 text-xl transition-colors duration-500">또는 다음으로 로그인</p>
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
    </>
  );
}
