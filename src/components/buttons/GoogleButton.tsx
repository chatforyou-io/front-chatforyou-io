import Image from 'next/image';
import React from 'react';

interface GoogleButtonProps {
  onClick: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Google 로그인"
      className="flex justify-center items-center w-16 h-16 bg-white shadow rounded-2xl"
    >
      <Image
        src="/images/icon-google.svg"
        alt="google"
        width={40}
        height={40}
        priority
      />
    </button>
  );
};

export default GoogleButton;