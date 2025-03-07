import { useRouter } from "next/navigation";
import IconKakao from "@/public/images/icon-kakao.svg";
import IconNaver from "@/public/images/icon-naver.svg";
import IconGoogle from "@/public/images/icon-google.svg";

interface SocialLoginCardProps {}

export default function SocialLoginCard({}: SocialLoginCardProps) {
  const router = useRouter();

  const socialLogin = async (provider: string) => {
    switch (provider) {
      case "naver":
        const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
        const naverRedirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
        const naverState = process.env.NEXT_PUBLIC_NAVER_STATE;
        router.push(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${naverRedirectUri}&state=${naverState}`);
        break;
      case "kakao":
        const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
        const kakaoRedirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
        const kakaoState = process.env.NEXT_PUBLIC_KAKAO_STATE;
        router.push(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&state=${kakaoState}`);
        break;
      case "google":
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const googleRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        const googleState = process.env.NEXT_PUBLIC_GOOGLE_STATE;
        router.push(`https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&state=${googleState}&include_granted_scopes=true&scope=email profile`);
        break;
    }
  };
  
  return (
    <div className="flex justify-between space-x-4 w-full pt-8 md:px-20">
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={() => socialLogin('kakao')}
          aria-label="kakao login button"
          className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-yellow-400 cursor-pointer">
          <IconKakao aria-label="kakao login" width={36} height={36} />
        </button>
        <p className="mt-2">Kakao</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={() => socialLogin('naver')}
          aria-label="naver login button"
          className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-green-600 text-white cursor-pointer">
          <IconNaver aria-label="naver login" width={32} height={32} />
        </button>
        <p className="mt-2">Naver</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={() => socialLogin('google')}
          aria-label="google login button"
          className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-white cursor-pointer">
          <IconGoogle aria-label="google login" width={48} height={48} />
        </button>
        <p className="mt-2">Google</p>
      </div>
    </div>
  );
}
