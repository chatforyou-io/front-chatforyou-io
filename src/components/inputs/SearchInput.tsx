import clsx from 'clsx';
import React from 'react';

interface NormalInputProps {
  type: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultValue?: string;
  error?: boolean;
}

const NormalInput: React.FC<NormalInputProps> = ({ type, name, onChange, placeholder, defaultValue, error }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <input
      type={type}
      name={name}
      onChange={onChange}
      className={clsx(`border pl-12 pr-6 py-4 w-full bg-white text-xl text-gray-700 bg-magnifying-glass bg-[left_8px_top_16px] bg-[length:28px_28px] bg-no-repeat placeholder-gray-700 outline-none rounded-full`, {
        "border-red-500": error,
      })}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

export default NormalInput;