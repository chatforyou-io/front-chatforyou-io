import { FormEvent, useState } from 'react';
import DimmedInput from '@/src/components/atoms/Input/DimmedInput';
import PrimaryButton from '@/src/components/atoms/Button/PrimaryButton';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    onSubmit(username, password);
  };

  return (
    <form className="w-full space-y-10" onSubmit={handleSubmit}>
      <DimmedInput
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="이메일 주소"
        defaultValue="" />
      <DimmedInput
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        defaultValue="" />
      <div className="space-y-4">
        <p className="text-blue-500 text-xl font-semibold">비밀번호를 잊으셨나요?</p>
        <PrimaryButton
          type={'submit'}
          label="로그인" />
      </div>
    </form>
  );
};

export default LoginForm;