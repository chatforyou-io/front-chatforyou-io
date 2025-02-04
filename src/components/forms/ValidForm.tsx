import { FormEvent, useEffect, useState } from "react";
import InputWithError from "@/src/components/items/InputWithError";

interface SignUpEmailValidFormProps {
  validCode: string;
  onSubmit: () => void;
}

export default function SignUpEmailValidForm({ validCode, onSubmit }: SignUpEmailValidFormProps) {
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const code = formData.get("code") as string;
    
    // Input 입력 체크
    const isValidCode = (input: string): boolean => input.trim() !== '' && input === validCode;
    if (!isValidCode(code)) {
      setErrorMsg("인증번호가 일치하지 않습니다.");
      return;
    }
    
    setErrorMsg(''); // Error 초기화
    onSubmit(); // 부모 컴포넌트로 id 전달
  };

  useEffect(() => {
    console.log("validCode:", validCode);
  }, [validCode]);

  return (
    <form onSubmit={handleSubmit}>
      <InputWithError type="text" name="code" placeholder="8자리 입력" label="인증번호" errorMessage={errorMsg} />
      <button type="submit" className="border mt-4 p-4 w-full h-16 bg-primary text-white rounded-full">계속</button>
    </form>
  );
}