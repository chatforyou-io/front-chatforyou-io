import IconKakao from "@/public/images/icon-kakao.svg";
import IconNaver from "@/public/images/icon-naver.svg";
import IconGoogle from "@/public/images/icon-google.svg";

const socialLoginProviders = [
  {
    name: "kakao",
    icon: <IconKakao aria-label="kakao login" width={36} height={36} />,
    label: "Kakao",
    customClass: "bg-yellow-400 text-black",
  },
  {
    name: "naver",
    icon: <IconNaver aria-label="naver login" width={32} height={32} />,
    label: "Naver",
    customClass: "bg-green-600 text-white",
  },
  {
    name: "google",
    icon: <IconGoogle aria-label="google login" width={48} height={48} />,
    label: "Google",
    customClass: "bg-white text-black",
  },
];

export default function SocialLoginCard() {
  const handleSocialLogin = (provider: string) => {
    window.location.href = `/chatforyouio/front/api/auth/social/${provider}`;
  };

  return (
    <div className="flex justify-center gap-12 w-full pt-8 md:px-20">
      {socialLoginProviders.map(({ name, icon, label, customClass }) => (
        <div className="flex flex-col justify-center items-center" key={name}>
          <button
            type="button"
            onClick={() => handleSocialLogin(name)}
            aria-label={`${label} login button`}
            className={`flex justify-center items-center w-16 h-16 shadow-sm rounded-2xl cursor-pointer ${customClass}`}
          >
            {icon}
          </button>
          <p className="mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
}