import clsx from "clsx";
import { InputHTMLAttributes } from "react";

interface InputWithErrorProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage: string | undefined;
}

export default function InputWithError({ type, name, placeholder, label, errorMessage }: InputWithErrorProps) {
  return (
    <div className="space-y-2">
      <input
        type={type}
        name={name}
        className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
          "border-red-500": errorMessage,
        })}
        placeholder={placeholder}
        aria-label={label}/>
      {errorMessage && <p className="text-error">{errorMessage}</p>}
    </div>
  );
}