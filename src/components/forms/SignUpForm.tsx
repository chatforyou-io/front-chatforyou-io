import { FormEvent } from "react";
import InputWithError from "@/src/components/items/InputWithError";
import { useSignUpValidation } from "@/src/webhooks/useSignUpValidation";

interface SignUpUserInfoFormProps {
  onSubmit: (name: string, pwd: string, confirmPwd: string) => void;
}

export default function SignUpForm({ onSubmit }: SignUpUserInfoFormProps) {
  const { errors, validate } = useSignUpValidation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const pwd = formData.get("pwd") as string;
    const confirmPwd = formData.get("confirmPwd") as string;

    if (!validate(name, pwd, confirmPwd)) return;

    // 부모 컴포넌트로 id 전달
    onSubmit(name, pwd, confirmPwd);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <InputWithError type="text" name="name" placeholder="이름" label="이름" errorMessage={errors.name} />
        <InputWithError type="password" name="pwd" placeholder="비밀번호" label="비밀번호" errorMessage={errors.password} />
        <InputWithError type="password" name="confirmPwd" placeholder="비밀번호 확인" label="비밀번호 확인" errorMessage={errors.confirmPwd} />
      </div>
      <div className="pt-4">
        <button type="submit" className="border p-4 w-full h-16 bg-primary text-white rounded-full">계속</button>
      </div>
    </form>
  );
}