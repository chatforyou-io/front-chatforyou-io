import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validSchema, ValidSchemaType } from "@/src/schemas/validSchema";

interface SignUpEmailValidFormProps {
  validCode: string;
  onSubmit: () => void;
}

export default function SignUpEmailValidForm({ validCode, onSubmit }: SignUpEmailValidFormProps) {
  // 인증번호 유효성 검사
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ValidSchemaType>({
    resolver: zodResolver(validSchema),
  });

  // 인증번호 유효성 검사 제출
  const processSubmit = async (data: ValidSchemaType) => {
    try {
      // 인증번호 유효성 검사
      const isValidCode = (input: string): boolean => input.trim() !== '' && input === validCode;
      if (!isValidCode(data.validCode)) {
        setError("root", { message: "인증번호가 일치하지 않습니다." });
        return;
      }

      // 인증번호 유효성 검사 성공 시
      onSubmit(); // 부모 컴포넌트로 id 전달
    } catch (error) {
      console.error(`인증번호 유효성 검사 중 오류 발생: ${error}`);
      setError("root", { message: "인증번호가 일치하지 않습니다." });
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="8자리 입력"
          aria-label="인증번호"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": errors.validCode,
          })}
          {...register("validCode")} />
        {errors.validCode && <p className="text-error">{errors.validCode?.message}</p>}
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