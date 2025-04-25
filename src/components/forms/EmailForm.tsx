import { FormEvent, useState } from "react";
import InputWithError from "@/src/components/items/InputWithError";
import { validate } from "@/src/libs/auth";
import { useHandleRequestFail } from "@/src/hooks/useHandleRequestFail";

interface SignUpEmailFormProps {
  onSubmit: (id: string, mailCode: string) => void;
}

export default function SignUpEmailForm({ onSubmit }: SignUpEmailFormProps) {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const handleRequestFail = useHandleRequestFail();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get("id") as string;
    
    // Input 입력 체크
    if (id === '') {
      setErrorMsg("이메일은 필수입니다.");
      return;
    }

    // Email 유효성 체크
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(id)) {
      setErrorMsg("유효한 이메일 주소를 입력하고 다시 시도하세요.");
      return;
    }

    try {
      // id 중복 체크
      const data = await validate(id);
      if (!data.isSuccess) throw new Error(handleRequestFail(data));

      // 수신받은 인증 번호
      if ("mailCode" in data) {
        const { mailCode } = data;
        // Error 초기화
        setErrorMsg('');
        

        // 부모 컴포넌트로 id 전달
        onSubmit(id, mailCode!);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch {
      setErrorMsg("이메일을 찾을 수 없습니다. 다시 시도하세요.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputWithError type="text" name="id" placeholder="이메일" label="이메일" errorMessage={errorMsg} />
      <button type="submit" className="border mt-4 p-4 w-full h-16 bg-primary text-white rounded-full">계속</button>
    </form>
  );
}