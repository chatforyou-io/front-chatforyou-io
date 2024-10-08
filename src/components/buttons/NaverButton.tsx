import Image from 'next/image';
import React from 'react';

interface NaverButtonProps {
  onClick: () => void;
}

const NaverButton: React.FC<NaverButtonProps> = ({ onClick }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  return (
    <button
      onClick={onClick}
      aria-label="Naver 로그인"
      className="flex justify-center items-center w-16 h-16 bg-green-600 shadow rounded-2xl"
    >
      <Image
        src={`${basePath}/images/icon-naver.svg`}
        alt="naver"
        width={32}
        height={32}
        priority
      />
    </button>
  );
};

export default NaverButton;