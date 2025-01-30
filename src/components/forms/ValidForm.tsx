import { FormEvent, useState } from 'react';
import clsx from 'clsx';

interface SignUpEmailValidFormProps {
  validCode: string;
  onSubmit: () => void;
}

export default function SignUpEmailValidForm({ validCode, onSubmit }: SignUpEmailValidFormProps) {
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const code = formData.get('code') as string;
    
    // Input 입력 체크
    if (code === '' || code !== validCode) {
      setError(true);
      setErrorMsg('인증번호가 일치하지 않습니다.');
      return;
    }

    // Error 초기화
    setError(false);
    setErrorMsg('');

    // 부모 컴포넌트로 id 전달
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          type="text"
          name="code"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": error,
          })}
          placeholder="4자리 입력"
          defaultValue={validCode}
        />
        { errorMsg && <p className="text-error">{errorMsg}</p> }
      </div>
      <button type="submit" className="border mt-4 p-4 w-full h-16 bg-gray-100 rounded-full">계속</button>
    </form>
  );
}