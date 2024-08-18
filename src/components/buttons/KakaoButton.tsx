import { SignInResponse } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

interface KakaoButtonProps {
  onClick: () => void;
}

const KakaoButton: React.FC<KakaoButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center w-16 h-16 bg-yellow-400 shadow rounded-2xl"
    >
      <Image
        src="/images/icon-kakao.svg"
        alt="kakao"
        width={36}
        height={36}
      />
    </button>
  );
};

export default KakaoButton;