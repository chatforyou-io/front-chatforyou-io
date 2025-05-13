import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialSignUpSchema, SocialSignUpSchemaType } from "@/src/schemas/socialSignUpSchema";
import { userCreate } from "@/src/libs/user";

interface SocialSignUpFormProps {
  id: string;
  name: string;
  nickName: string;
}

export default function SocialSignUpForm({ id, name, nickName }: SocialSignUpFormProps) {
  const router = useRouter();

  // 소셜 회원가입 유효성 검사
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SocialSignUpSchemaType>({
    resolver: zodResolver(socialSignUpSchema),
  });

  // 소셜 회원가입 제출
  const processSubmit = async ({ id, name, nickName, pwd, confirmPwd }: SocialSignUpSchemaType) => {
    try {
      const { isSuccess, message } = await userCreate({ id, name, nickName, pwd, confirmPwd, usePwd: false });

      // 회원가입 실패 시 오류 메시지 설정
      if (!isSuccess) {
        setError("root", { message });
        return;
      }
      
      // 회원가입 성공 시 로그인 페이지로 이동
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      setError("root", { message: "회원가입 유효성 검사 중 오류 발생" });
    }
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <input
        type="hidden"
        defaultValue={id}
        {...register("id")}
      />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="이름"
            aria-label="이름"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            defaultValue={name}
            readOnly
            {...register("name")}
          />
          {errors.name && <p className="text-error">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="닉네임"
            aria-label="닉네임"
            className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
              "border-red-500": errors.nickName,
            })}
            defaultValue={nickName}
            {...register("nickName")}
          />
          {errors.nickName && <p className="text-error">{errors.nickName.message}</p>}
        </div>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="비밀번호"
            aria-label="비밀번호"
            className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
              "border-red-500": errors.pwd,
            })}
            {...register("pwd")} />
          {errors.pwd && <p className="text-error">{errors.pwd.message}</p>}
        </div>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="비밀번호 확인"
            aria-label="비밀번호 확인"
            className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
              "border-red-500": errors.confirmPwd,
            })}
            {...register("confirmPwd")} />
          {errors.confirmPwd && <p className="text-error">{errors.confirmPwd.message}</p>}
        </div>
      </div>
      <div className="pt-4">
        <div className="space-y-2">
          <button
            type="submit"
            className={clsx("border p-4 w-full h-16 bg-primary text-white rounded-full", {
              "border-red-500": errors.root,
            })}>
            계속
          </button>
          {errors.root && <p className="text-error">{errors.root.message}</p>}
        </div>
      </div>
    </form>
  );
}