import { useForm } from "react-hook-form";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/src/contexts/SessionContext";
import { loginSchema, LoginFormType } from "@/src/schemas/loginSchema";

export default function LoginForm() {
  const { signIn } = useSession();

  // 로그인 유효성 검사
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  // 로그인 제출
  const processSubmit = async (data: LoginFormType) => {
    try {
      // 로그인 요청
      const { isSuccess, message } = await signIn(data.username, data.password);

      // 로그인 실패 시
      if (!isSuccess) {
        setError("root", { message });
        return;
      }

      // 로그인 성공 시
      window.location.reload();
    } catch (error) {
      console.error(`로그인 중 오류 발생: ${error}`);
      setError("root", { message: "알 수 없는 오류가 발생했습니다." });
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="w-full">
      <div className="pt-4 space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="이메일 주소"
            aria-label="이메일 주소"
            className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
              "border-red-500": errors.username,
            })}
            {...register("username")} />
          {errors.username && <p className="text-error">{errors.username?.message}</p>}
        </div>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="비밀번호"
            aria-label="비밀번호"
            className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
              "border-red-500": errors.password,
            })}
            {...register("password")} />
          {errors.password && <p className="text-error">{errors.password?.message}</p>}
        </div>
      </div>
      <div className="pt-4 space-y-4">
        <p className="text-primary font-semibold">비밀번호를 잊으셨나요?</p>
        <div className="space-y-2">
          <button
            type="submit"
            aria-label="로그인"
            className={clsx("border px-4 h-16 w-full bg-primary text-white rounded-full", {
              "border-red-500": errors.root,
            })}>
            로그인
          </button>
          {errors.root?.message && <p className="text-error">{errors.root?.message}</p>}
        </div>
      </div>
    </form>
  );
}