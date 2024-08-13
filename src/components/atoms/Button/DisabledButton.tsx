import React from 'react';

interface DisabledButtonProps {
  onClick: () => void;
  label: string;
}

const DisabledButton: React.FC<DisabledButtonProps> = ({ onClick, label }) => {
  return (
    <button
      className="w-full p-[17px] h-[60px] border bg-blue-500 text-xl leading-5 text-white rounded-full"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default DisabledButton;