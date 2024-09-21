import Image from 'next/image';
import React from 'react';

interface KakaoButtonProps {
  onClick: () => void;
}

const KakaoButton: React.FC<KakaoButtonProps> = ({ onClick }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  return (
    <button
      onClick={onClick}
      aria-label="Kakao 로그인"
      className="flex justify-center items-center w-16 h-16 bg-yellow-400 shadow rounded-2xl"
    >
      <Image
        src={`${basePath}/images/icon-kakao.svg`}
        alt="kakao"
        width={36}
        height={36}
        priority
      />
    </button>
  );
};

export default KakaoButton;