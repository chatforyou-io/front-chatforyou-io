'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import PrimaryButton from "@/src/components/atoms/Button/PrimaryButton";
import DimmedInput from "@/src/components/atoms/Input/DimmedInput";

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [confirmState, setConfirmState] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async () => {
    if (!confirmState) {
      alert('중복확인을 해주세요.');
      return;
    }

    if (!name || !id || !pwd || !confirmPwd) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    // 이메일 정규식 패턴
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(id)) {
      alert('이메일 주소 형식이 올바르지 않습니다.');
      return;
    }

    // 비밀번호 정규식 패턴
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(pwd)) {
      alert('비밀번호는 최소 8자, 영문, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    if (pwd !== confirmPwd) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const user: User = {
      idx: 0,
      name: name,
      id: id,
      pwd: btoa(pwd),
      confirmPwd: btoa(confirmPwd),
      use_pwd: true,
      nick_name: '',
      create_date: ''
    };
    
    const response = await fetch('/api/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!data.isSuccess) {
      alert('가입에 실패하였습니다.');
      return;
    }

    alert('가입에 성공하였습니다.');
    router.push('/auth/login');
  }

  const handleValidate = async () => {
    if (!id) {
      alert('이메일 주소를 입력해주세요.');
      return;
    }

    const response = await fetch(`/api/user/validate?id=${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!data.isSuccess) {
      alert('이미 등록된 이메일 주소입니다.');
      return;
    }

    alert('사용 가능한 이메일 주소입니다.');
    setConfirmState(true);
  }

  return (
    <form className='w-full space-y-10' onSubmit={handleSubmit}>
      <DimmedInput type='text' onChange={(e) => setName(e.target.value)} placeholder='이름' defaultValue='' />
      <DimmedInput type='text' onChange={(e) => setId(e.target.value)} placeholder='이메일 주소' defaultValue='' />
      <PrimaryButton onClick={handleValidate} label='중복확인' type={"submit"} />
      <DimmedInput type='password' onChange={(e) => setPwd(e.target.value)} placeholder='비밀번호' defaultValue='' />
      <DimmedInput type='password' onChange={(e) => setConfirmPwd(e.target.value)} placeholder='비밀번호 확인' defaultValue='' />
      <PrimaryButton onClick={() => {}} label='가입하기' type={"submit"} />
    </form>
  );
}