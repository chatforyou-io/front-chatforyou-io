import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import ButtonWithError from "@/src/components/items/ButtonWithError";
import InputWithError from "@/src/components/items/InputWithError";
import { useSession } from "@/src/contexts/SessionContext";
import { useLoginValidation } from "@/src/hooks/useLoginValidation";

export default function LoginForm() {
  const { signIn } = useSession();
  const { errors, setErrors, validate } = useLoginValidation();
  const router = useRouter();

  // 로그인 요청
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // 유효성 검사
    if (!validate(username, password)) return;

    try {
      // 로그인 요청
      const { isSuccess, message } = await signIn(username, password);

      // 로그인 실패 시
      if (!isSuccess) {
        throw new Error(message);
      }

      // 로그인 성공 시
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      handleSubmitError(errorMessage);
    }
  };
  
  // 로그인 실패 시 오류 처리
  const handleSubmitError = (error: string) => {
    setErrors(prevErrors => ({ ...prevErrors, login: error }));
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