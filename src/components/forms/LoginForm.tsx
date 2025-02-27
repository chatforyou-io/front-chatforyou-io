import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import ButtonWithError from "@/src/components/items/ButtonWithError";
import InputWithError from "@/src/components/items/InputWithError";
import { useUser } from "@/src/contexts/AuthProvider";
import { useLoginValidation } from "@/src/webhooks/useLoginValidation";

export default function LoginForm() {
  const { setUser } = useUser();
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
      const { status, data } = await axios.post("/chatforyouio/front/api/login", { username, password });
      const { userData, message } = data;

      // 로그인 실패 시
      if (status !== 200) {
        throw new Error(message || "알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해주세요.");
      }

      console.log(userData);

      // 로그인 성공 시
      setUser(userData);

      // 로그인 성공 시
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        handleSubmitError(errorMessage);
      }
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