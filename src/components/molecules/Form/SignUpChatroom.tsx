import React, { useRef, useState } from 'react';
import PrimaryButton from '@/src/components/atoms/Button/PrimaryButton';
import DimmedInput from '@/src/components/atoms/Input/DimmedInput';

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

interface SignUpChatroomProps {
  onSubmit: (formData: FormData) => void;
}

export default function SignUpChatroom({ onSubmit }: SignUpChatroomProps) {
  const [mySessionId, setMySessionId] = useState('');
  const [myUsername, setMyUsername] = useState('');
  const [maxUserCount, setMaxUserCount] = useState(2);

  const handleSubmit = () => {
    if (!mySessionId || !myUsername || !maxUserCount) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    onSubmit({ mySessionId, myUsername, maxUserCount });
  }

  return (
    <form className="w-full max-w-xl">
      <div className='flex justify-between gap-8 mt-8 w-full'>
        <p className="py-4 w-36 text-gray-700 text-xl font-semibold">제목</p>
        <DimmedInput type='text' onChange={(e) => setMySessionId(e.target.value)} placeholder='제목' defaultValue='SessionA' />
      </div>
      <div className='flex justify-between gap-8 mt-8 w-full'>
        <p className="py-4 w-36 text-gray-700 text-xl font-semibold">닉네임</p>
        <DimmedInput type='text' onChange={(e) => setMyUsername(e.target.value)} placeholder='닉네임' defaultValue={"Participant" + Math.floor(Math.random() * 100)} />
      </div>
      <div className='flex justify-between gap-8 mt-8 w-full'>
        <p className="py-4 w-36 text-gray-700 text-xl font-semibold">접속인원</p>
        <DimmedInput type='text' onChange={(e) => setMaxUserCount(parseInt(e.target.value))} placeholder='접속인원' defaultValue='2' />
      </div>
      <PrimaryButton onClick={handleSubmit} label='방 만들기' />
    </form>
  );
}

