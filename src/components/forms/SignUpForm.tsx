import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchemaType } from "@/src/schemas/signUpSchema";

interface SignUpFormProps {
  onSubmit: (name: string, pwd: string, confirmPwd: string) => void;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const processSubmit = async (data: SignUpSchemaType) => {
    onSubmit(data.name, data.pwd, data.confirmPwd);
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="이름"
          aria-label="이름"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": errors.name,
          })}
          {...register("name")} />
        {errors.name && <p className="text-error">{errors.name?.message}</p>}
        <input
          type="password"
          placeholder="비밀번호"
          aria-label="비밀번호"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": errors.pwd,
          })}
          {...register("pwd")} />
        {errors.pwd && <p className="text-error">{errors.pwd?.message}</p>}
        <input
          type="password"
          placeholder="비밀번호 확인"
          aria-label="비밀번호 확인"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": errors.confirmPwd,
          })}
          {...register("confirmPwd")} />
        {errors.confirmPwd && <p className="text-error">{errors.confirmPwd?.message}</p>}
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className={clsx("border p-4 w-full h-16 bg-primary text-white rounded-full", {
            "border-red-500": errors.root,
          })}>
          계속
        </button>
      </div>
    </form>
  );
}