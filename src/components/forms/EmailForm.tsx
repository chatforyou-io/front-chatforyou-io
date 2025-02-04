import { FormEvent, useState } from 'react';
import clsx from 'clsx';
import { validate } from '@/src/libs/auth';
import { useHandleRequestFail } from '@/src/webhooks/useHandleRequestFail';

interface SignUpEmailFormProps {
  onSubmit: (id: string, mailCode: string) => void;
}

export default function SignUpEmailForm({ onSubmit }: SignUpEmailFormProps) {
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const handleRequestFail = useHandleRequestFail();

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

    try {
      // id 중복 체크
      const data = await validate(id);
      if (!data.isSuccess) throw new Error(handleRequestFail(data));

      // 수신받은 인증 번호
      if ('mailCode' in data) {
        const { mailCode } = data;
        // Error 초기화
        setError(false);
        setErrorMsg('');

        // 부모 컴포넌트로 id 전달
        onSubmit(id, mailCode);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMsg('이메일을 찾을 수 없습니다. 다시 시도하세요.');
    }
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