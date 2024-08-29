import { FormEvent, useState } from 'react';
import PrimaryButton from '@/src/components/buttons/PrimaryButton';
import NormalInput from '@/src/components/inputs/NormalInput';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [usernameErrorMsg, setUSernameErrorMsg] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('');
  const [loginError, setLoginError] = useState<boolean>(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    // Input 입력 체크
    if (username === '') {
      setUsernameError(true);
      setUSernameErrorMsg('이메일은 필수입니다.');
      return;
    }

    // Email 유효성 체크
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(username)) {
      setUsernameError(true);
      setUSernameErrorMsg('유효한 이메일 주소를 입력하고 다시 시도하세요.');
      return;
    }

    // Error 초기화
    setUsernameError(false);
    setUSernameErrorMsg('');    

    const numberReg = /[0-9]/;
    const alphabetsReg = /[a-zA-Z]/;
    const specialCharReg = /[~!@#$%^&*()_+|<>?:{}]/;
    if (password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMsg('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (!numberReg.test(password)) {
      setPasswordError(true);
      setPasswordErrorMsg('비밀번호는 숫자를 포함해야 합니다.');
      return;
    }
    if (!alphabetsReg.test(password)) {
      setPasswordError(true);
      setPasswordErrorMsg('비밀번호는 영문자를 포함해야 합니다.');
      return;
    }
    if (!specialCharReg.test(password)) {
      setPasswordError(true);
      setPasswordErrorMsg('비밀번호는 특수문자를 포함해야 합니다.');
      return;
    }

    // Error 초기화
    setPasswordError(false);
    setPasswordErrorMsg('');
    setLoginError(false);
    setLoginErrorMsg('');

    try {
      const response = await signIn('credentials', { redirect: false, username, password: btoa(password) });
      if (!response) {
        throw new Error('Unknown error');
      }
      if (!response.ok) {
        throw new Error(response.error || 'Unknown error');
      }

      // 로그인 성공 시 홈페이지로 리다이렉트
      router.push('/');
      
      // 페이지 데이터 새로고침
      router.refresh();
    } catch (error) {
      handleSubmitError(error?.toString() || 'Unknown error');
      return;
    }
  };
  
  const handleSubmitError = (error: string) => {
    let errorMessage = '알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해 주세요.';

    switch (error) {
      case 'CredentialsSignin': 
        errorMessage = '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.';
        break;
      case 'OAuthSignin': 
        errorMessage = '소셜 로그인에 실패했습니다. 다른 계정으로 시도해 보세요.';
        break;
    }

    setLoginError(true);
    setLoginErrorMsg(errorMessage);
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <div className='space-y-[7px]'>
        <NormalInput type="text" name="username" placeholder="이메일 주소" />
        { usernameError && <p className="text-error text-[17px]">{usernameErrorMsg}</p> }
        <NormalInput type="password" name="password" placeholder="비밀번호" />
        { passwordError && <p className="text-error text-[17px]">{passwordErrorMsg}</p> }
      </div>
      <div className="space-y-5">
        <p className="text-blue-500 text-xl font-semibold">비밀번호를 잊으셨나요?</p>
        <PrimaryButton type="submit" data-label="로그인" label="로그인" />
        { loginError && <p className="text-error text-[17px]">{loginErrorMsg}</p> }
      </div>
    </form>
  );
}