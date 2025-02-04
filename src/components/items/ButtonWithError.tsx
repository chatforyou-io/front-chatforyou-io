import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface ButtonWithErrorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  errorMessage: string | undefined;
}

export default function ButtonWithError({ type, name, label, errorMessage }: ButtonWithErrorProps) {
  return (
    <div className="space-y-2">
      <button
        type={type}
        name={name}
        className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
          "border-red-500": errorMessage,
        })}>
        {label}
      </button>
      {errorMessage && <p className="text-error">{errorMessage}</p>}
    </div>
  );
}