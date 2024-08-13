import { FormEvent, useState } from 'react';
import NormalInput from '@/src/components/atoms/Input/NormalInput';
import DimmedButton from '@/src/components/atoms/Button/DimmedButton';

interface SignUpUserInfoFormProps {
  onSubmit: (name: string, pwd: string, confirmPwd: string) => void;
}

const SignUpUserInfoForm: React.FC<SignUpUserInfoFormProps> = ({ onSubmit }) => {
  const [nameError, setNAmeError] = useState<boolean>(false);
  const [nameErrorMsg, setNameErrorMsg] = useState<string>('');
  const [pwdError, setPwdError] = useState<boolean>(false);
  const [pwdErrorMsg, setPwdErrorMsg] = useState<string>('');
  const [confirmPwdError, setConfirmPwdError] = useState<boolean>(false);
  const [confirmPwdErrorMsg, setConfirmPwdErrorMsg] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const pwd = formData.get('pwd') as string;
    const confirmPwd = formData.get('confirmPwd') as string;

    // 부모 컴포넌트로 id 전달
    onSubmit(name, pwd, confirmPwd);
  }

  return (
    <form className='space-y-10' onSubmit={handleSubmit}>
      <div className='space-y-5'>
        <NormalInput type={'input'} name={'name'} placeholder={'이름'} error={nameError} />
        { nameErrorMsg && <p className='text-error text-[17px]'>{nameErrorMsg}</p> }
        <NormalInput type={'password'} name={'pwd'} placeholder={'비밀번호'} error={pwdError} />
        { pwdErrorMsg && <p className='text-error text-[17px]'>{pwdErrorMsg}</p> }
        <NormalInput type={'password'} name={'confirmPwd'} placeholder={'비밀번호 확인'} error={confirmPwdError} />
        { confirmPwdErrorMsg && <p className='text-error text-[17px]'>{confirmPwdErrorMsg}</p> }
      </div>
      <DimmedButton type={'submit'} onClick={() => {}} label={'계속'} />
    </form>
  );
};

export default SignUpUserInfoForm;