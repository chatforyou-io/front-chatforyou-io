import { FormEvent, useState } from 'react';
import DimmedButton from '@/src/components/buttons/DimmedButton';
import clsx from 'clsx';
interface SignUpUserInfoFormProps {
  onSubmit: (name: string, pwd: string, confirmPwd: string) => void;
}

export default function SignUpUserInfoForm({ onSubmit }: SignUpUserInfoFormProps) {
  const [nameError, setNameError] = useState<boolean>(false);
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

    if (!name) {
      setNameError(true);
      setNameErrorMsg('이름은 필수입니다.');
      return;
    } else if (name.length < 3) {
      setNameError(true);
      setNameErrorMsg('이름은 3자 이상이어야 합니다.');
      return;
    }

    // Error 초기화
    setNameError(false);
    setNameErrorMsg('');

    const numberReg = /[0-9]/;
    const alphabetsReg = /[a-zA-Z]/;
    const specialCharReg = /[~!@#$%^&*()_+|<>?:{}]/;
    if (pwd.length < 8) {
      setPwdError(true);
      setPwdErrorMsg('비밀번호는 8자 이상이어야 합니다.');
      return;
    } else if (!numberReg.test(pwd)) {
      setPwdError(true);
      setPwdErrorMsg('비밀번호는 숫자를 포함해야 합니다.');
      return;
    } else if (!alphabetsReg.test(pwd)) {
      setPwdError(true);
      setPwdErrorMsg('비밀번호는 영문자를 포함해야 합니다.');
      return;
    } else if (!specialCharReg.test(pwd)) {
      setPwdError(true);
      setPwdErrorMsg('비밀번호는 특수문자를 포함해야 합니다.');
      return;
    }

    // Error 초기화
    setPwdError(false);
    setPwdErrorMsg('');
    
    if (pwd !== confirmPwd) {
      setConfirmPwdError(true);
      setConfirmPwdErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    // Error 초기화
    setConfirmPwdError(false);
    setConfirmPwdErrorMsg('');

    // 부모 컴포넌트로 id 전달
    onSubmit(name, pwd, confirmPwd);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          className={clsx("border px-6 py-4 w-full bg-white rounded-full", {
            "border-red-500": nameError,
          })}
          placeholder="이름"
        />
        { nameErrorMsg && <p className="text-error">{nameErrorMsg}</p> }
        <input
          type="password"
          name="pwd"
          className={clsx("border px-6 py-4 w-full bg-white rounded-full", {
            "border-red-500": pwdError,
          })}
          placeholder="비밀번호"
        />
        { pwdErrorMsg && <p className="text-error">{pwdErrorMsg}</p> }
        <input
          type="password"
          name="confirmPwd"
          className={clsx("border px-6 py-4 w-full bg-white rounded-full", {
            "border-red-500": confirmPwdError,
          })}
          placeholder="비밀번호 확인"
        />
        { confirmPwdErrorMsg && <p className="text-error">{confirmPwdErrorMsg}</p> }
      </div>
      <button type="submit" className="border mt-4 p-4 w-full h-16 bg-gray-100 rounded-full">계속</button>
    </form>
  );
}