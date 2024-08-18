import React from 'react';

interface DimmedInputProps {
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  defaultValue: string;
}

const DimmedInput: React.FC<DimmedInputProps> = ({ type, onChange, placeholder, defaultValue }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className='border px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full'
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

export default DimmedInput;