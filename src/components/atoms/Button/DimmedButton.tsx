import React from 'react';

interface DimmedButtonProps {
  type: "button" | "submit" | "reset";
  onClick: () => void;
  label: string;
}

const DimmedButton: React.FC<DimmedButtonProps> = ({ type, onClick, label }) => {
  return (
    <button
      type={type}
      className="w-full p-[17px] h-[60px] border bg-gray-100 text-xl text-gray-700 placeholder-gray-700 leading-5 rounded-full"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default DimmedButton;