import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ButtonWithError from "@/src/components/items/ButtonWithError";
import InputWithError from "@/src/components/items/InputWithError";
import { useLoginValidation } from "@/src/webhooks/useLoginValidation";

export default function LoginForm() {
  const router = useRouter();
  const { errors, setErrors, validate } = useLoginValidation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!validate(username, password)) return;

    try {
      const response = await signIn("credentials", { redirect: false, username, password });
      if (response && response.error) throw new Error(response.error);
      
      router.push("/");
    } catch (error) {
      console.log(error);
      handleSubmitError(error instanceof Error ? error.message : "Unknown error");
    }
  };
  
  const handleSubmitError = (error: string) => {
    const errorMessages: Record<string, string> = {
      "CredentialsSignin": "아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해주세요.",
      "OAuthSignin": "소셜 로그인에 실패했습니다. 다시 시도해주세요.",  
    };
    setErrors(prevErrors => ({ ...prevErrors, login: errorMessages[error] || "알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해주세요." }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="pt-4 space-y-4">
        <InputWithError type="text" name="username" placeholder="이메일 주소" label="이메일 주소" errorMessage={errors.username} />
        <InputWithError type="password" name="password" placeholder="비밀번호" label="비밀번호" errorMessage={errors.password} />
      </div>
      <div className="pt-4 space-y-4">
        <p className="text-primary font-semibold">비밀번호를 잊으셨나요?</p>
        <ButtonWithError type="submit" name="login" label="로그인" errorMessage={errors.login} />
      </div>
    </form>
  );
}