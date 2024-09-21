import React, { FormEvent, useState } from 'react';
import PrimaryButton from '@/src/components/buttons/PrimaryButton';
import DimmedInput from '@/src/components/inputs/DimmedInput';
import Link from 'next/link';

interface ChatroomCreateFormProps {
  onSubmit: (roomName: string, description: string, maxUserCount: number, usePwd: boolean, pwd: string) => void;
}

export default function ChatroomCreateForm({ onSubmit }: ChatroomCreateFormProps) {  
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const roomName = formData.get('roomName') as string || '';
    const description = formData.get('description') as string || '';
    const maxUserCount = parseInt(formData.get('maxUserCount') as string) || 0;
    const usePwd = formData.get('usePwd') as string === 'on';
    const pwd = formData.get('pwd') as string || '';

    if (!roomName || maxUserCount === 0) {
      alert('제목과 접속인원은 필수입니다.');
      return;
    }

    if (usePwd && !pwd) {
      alert('암호를 입력하세요.');
      return;
    }
    
    // 부모 컴포넌트로 데이터 전달
    onSubmit(roomName, description, maxUserCount, usePwd, pwd);
  };

  return (
    <form className="w-full max-w-xl space-y-12" onSubmit={handleSubmit}>
      <div className="space-y-8">
        <DimmedInput type="text" name="roomName" placeholder="제목" />
        <DimmedInput type="text" name="description" placeholder="설명" />
        <select name="maxUserCount" className="border px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full">
          <option value="">접속인원</option>
          <option value="2">2명</option>
          <option value="3">3명</option>
          <option value="4">4명</option>
          <option value="5">5명</option>
          <option value="6">6명</option>
          <option value="7">7명</option>
          <option value="8">8명</option>
          <option value="9">9명</option>
          <option value="10">10명</option>
        </select>
        <div className="flex gap-4">
          <input type="checkbox" name="usePwd" />
          <DimmedInput type="text" name="pwd" placeholder="암호" />
        </div>
      </div>
      <div className="flex gap-9">
        <Link href={`${basePath}/`} className="w-full p-[17px] h-[60px] border bg-gray-100 text-xl text-gray-700 placeholder-gray-700 leading-5 text-center rounded-full">취소</Link>
        <PrimaryButton type="submit" label="방 만들기" />
      </div>
    </form>
  );
}

