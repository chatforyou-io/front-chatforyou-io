import clsx from 'clsx';
import React from 'react';

interface DimmedInputProps {
  type: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultValue?: string;
  error?: boolean;
}

const DimmedInput: React.FC<DimmedInputProps> = ({ type, name, onChange, placeholder, defaultValue, error }) => {
  return (
    <input
      type={type}
      name={name}
      onChange={onChange}
      className={clsx('border px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full', {
        'border-red-500': error,
      })}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

export default DimmedInput;