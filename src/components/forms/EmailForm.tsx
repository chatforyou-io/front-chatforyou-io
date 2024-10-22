import { FormEvent, useState } from 'react';
import { userValidate } from '@/src/libs/auth';
import clsx from 'clsx';

interface SignUpEmailFormProps {
  onSubmit: (id: string, mailCode: string) => void;
}

export default function SignUpEmailForm({ onSubmit }: SignUpEmailFormProps) {
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get('id') as string;
    
    // Input 입력 체크
    if (id === '') {
      setError(true);
      setErrorMsg('이메일은 필수입니다.');
      return;
    }

    // Email 유효성 체크
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(id)) {
      setError(true);
      setErrorMsg('유효한 이메일 주소를 입력하고 다시 시도하세요.');
      return;
    }

    // id 중복 체크
    const data = await userValidate(id);
    if (!data.isSuccess) {
      setError(true);
      setErrorMsg('이미 가입된 이메일 주소입니다. 다른 이메일을 입력하거나 지금 로그인 하십시오.');
      return;
    }

    // 수신받은 인증 번호
    const mailCode = data.mailCode!;

    // Error 초기화
    setError(false);
    setErrorMsg('');

    // 부모 컴포넌트로 id 전달
    onSubmit(id, mailCode);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          type="text"
          name="id"
          className={clsx("border px-4 h-16 w-full bg-white rounded-full", {
            "border-red-500": error,
          })}
          placeholder="이메일"
        />
        { errorMsg && <p className="text-error">{errorMsg}</p> }
      </div>
      <button type="submit" className="border mt-4 p-4 w-full h-16 bg-gray-100 rounded-full">계속</button>
    </form>
  );
}