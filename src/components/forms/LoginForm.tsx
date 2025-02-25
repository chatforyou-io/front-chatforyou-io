import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import ButtonWithError from "@/src/components/items/ButtonWithError";
import InputWithError from "@/src/components/items/InputWithError";
import { useLoginValidation } from "@/src/webhooks/useLoginValidation";
import instance from "@/src/libs/utils/instance";
import { AxiosError } from "axios";

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
      // 로그인 요청
      const response = await instance.post("/chatforyouio/front/api/login", { username, password });

      // 로그인 실패 시
      if (response.status !== 200) throw new Error(response.data.message);

      // 로그인 성공 시
      router.push("/");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        handleSubmitError(errorMessage);
      }
    }
  };
  
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