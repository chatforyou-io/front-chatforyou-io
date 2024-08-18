import Image from 'next/image';
import React from 'react';

interface NaverButtonProps {
  onClick: () => void;
}

const NaverButton: React.FC<NaverButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center w-16 h-16 bg-green-600 shadow rounded-2xl"
    >
      <Image
        src="/images/icon-naver.svg"
        alt="naver"
        width={32}
        height={32}
      />
    </button>
  );
};

export default NaverButton;