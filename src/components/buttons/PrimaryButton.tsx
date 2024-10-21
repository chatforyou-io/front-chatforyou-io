import React from 'react';

interface PrimaryButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  label: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ type, onClick, label }) => {
  return (
    <button
      type={type}
      className="w-full p-[17px] h-[60px] border bg-primary-normal text-lg leading-5 text-white rounded-full"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;