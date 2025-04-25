import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validate } from "@/src/libs/auth";
import { emailSchema, EmailSchemaType } from "@/src/schemas/emailSchema";

interface SignUpEmailFormProps {
  onSubmit: (id: string, mailCode: string) => void;
}

export default function SignUpEmailForm({ onSubmit }: SignUpEmailFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
  });

  const processSubmit = async (data: EmailSchemaType) => {
    try {
      // id 중복 체크
      const { isSuccess, result, mailCode } = await validate(data.email);

      if (!isSuccess) {
        setError('root', { message: result });
        return;
      }

      onSubmit(data.email, mailCode ?? "");
    } catch {
      setError('root', { message: "이메일을 찾을 수 없습니다. 다시 시도하세요." });
    }
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="이메일"
          aria-label="이메일"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": errors.email,
          })}
          {...register("email")} />
        {errors.email && <p className="text-error">{errors.email?.message}</p>}
      </div>
      <button
        type="submit"
        className={clsx("border mt-4 p-4 w-full h-16 bg-primary text-white rounded-full", {
          "border-red-500": errors.root,
        })}>
        계속
      </button>
    </form>
  );
}