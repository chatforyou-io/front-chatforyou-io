import { FormEvent, useEffect, useState } from 'react';
import NormalInput from '@/src/components/inputs/NormalInput';
import DimmedButton from '@/src/components/buttons/DimmedButton';
import { userValidate } from '@/src/libs/auth';

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

  useEffect(() => {
    console.log('validCode: ', validCode);
  }, [validCode]);

  return (
    <form className='space-y-10' onSubmit={handleSubmit}>
      <div className='space-y-[7px]'>
        <NormalInput type={'input'} name={'code'} placeholder={'4자리 입력'} defaultValue={validCode} error={error} />
        { errorMsg && <p className='text-error text-[17px]'>{errorMsg}</p> }
      </div>
      <DimmedButton type={'submit'} onClick={() => {}} label={'계속'} />
    </form>
  );
}