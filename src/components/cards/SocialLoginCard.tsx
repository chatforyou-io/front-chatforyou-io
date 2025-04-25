import IconKakao from "@/public/images/icon-kakao.svg";
import IconNaver from "@/public/images/icon-naver.svg";
import IconGoogle from "@/public/images/icon-google.svg";

export default function SocialLoginCard() {
  const handleSocialLogin = (provider: string) => {
    window.location.href = `/chatforyouio/front/api/auth/social/${provider}`;
  };

  return (
    <div className="flex justify-between space-x-4 w-full pt-8 md:px-20">
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={() => handleSocialLogin("kakao")}
          aria-label="kakao login button"
          className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-yellow-400 cursor-pointer">
          <IconKakao aria-label="kakao login" width={36} height={36} />
        </button>
        <p className="mt-2">Kakao</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={() => handleSocialLogin("naver")}
          aria-label="naver login button"
          className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-green-600 text-white cursor-pointer">
          <IconNaver aria-label="naver login" width={32} height={32} />
        </button>
        <p className="mt-2">Naver</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          aria-label="google login button"
          className="flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl bg-white cursor-pointer">
          <IconGoogle aria-label="google login" width={48} height={48} />
        </button>
        <p className="mt-2">Google</p>
      </div>
    </div>
  );
}
