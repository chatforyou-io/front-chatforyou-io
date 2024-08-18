import React, { useRef, useState } from 'react';
import PrimaryButton from '@/src/components/buttons/PrimaryButton';
import DimmedInput from '@/src/components/inputs/DimmedInput';
import DimmedButton from '../buttons/DimmedButton';
import { useRouter } from 'next/navigation';

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

interface ChatroomCreateFormProps {
  onSubmit: (formData: FormData) => void;
}

export default function ChatroomCreateForm({ onSubmit }: ChatroomCreateFormProps) {
  const [mySessionId, setMySessionId] = useState('');
  const [myUsername, setMyUsername] = useState('');
  const [maxUserCount, setMaxUserCount] = useState(2);
  const router = useRouter();

  const handleSubmit = () => {
    if (!mySessionId || !myUsername || !maxUserCount) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    onSubmit({ mySessionId, myUsername, maxUserCount });
  }

  const handleClick = () => {
    router.push('/');
  }

  return (
    <form className="w-full max-w-xl space-y-12" onSubmit={handleSubmit}>
      <div className='space-y-8'>
        <DimmedInput type='text' onChange={(e) => setMySessionId(e.target.value)} placeholder='제목' defaultValue='SessionA' />
        <DimmedInput type='text' onChange={(e) => setMyUsername(e.target.value)} placeholder='닉네임' defaultValue={"Participant" + Math.floor(Math.random() * 100)} />
        <DimmedInput type='text' onChange={(e) => setMaxUserCount(parseInt(e.target.value))} placeholder='접속인원' defaultValue='2' />
      </div>
      <div className="flex gap-9">
        <DimmedButton type="button" label='취소' onClick={handleClick} />
        <PrimaryButton type="submit" label='방 만들기' />
      </div>
    </form>
  );
}

