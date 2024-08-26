import React, { useRef, useState } from 'react';
import PrimaryButton from '@/src/components/buttons/PrimaryButton';
import DimmedInput from '@/src/components/inputs/DimmedInput';
import DimmedButton from '../buttons/DimmedButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    // 메인 페이지로 리다이렉트
    router.push('/');
      
    // 페이지 데이터 새로고침
    router.refresh();
  }

  return (
    <form className="w-full max-w-xl space-y-12" onSubmit={handleSubmit}>
      <div className='space-y-8'>
        <DimmedInput type='text' onChange={(e) => setMySessionId(e.target.value)} placeholder='제목' defaultValue='SessionA' />
        <DimmedInput type='text' onChange={(e) => setMyUsername(e.target.value)} placeholder='닉네임' defaultValue={"Participant" + Math.floor(Math.random() * 100)} />
        <DimmedInput type='text' onChange={(e) => setMaxUserCount(parseInt(e.target.value))} placeholder='접속인원' defaultValue='2' />
      </div>
      <div className="flex gap-9">
        <Link href="/" className="w-full p-[17px] h-[60px] border bg-gray-100 text-xl text-gray-700 placeholder-gray-700 leading-5 text-center rounded-full">취소</Link>
        <Link href="/chatroom/view" className="w-full p-[17px] h-[60px] border bg-blue-500 text-xl leading-5 text-center text-white rounded-full">방 만들기</Link>
      </div>
    </form>
  );
}

