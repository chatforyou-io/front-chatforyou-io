import React, { FormEvent, useState } from 'react';
import Link from 'next/link';

interface ChatroomCreateFormProps {
  onSubmit: (roomName: string, maxUserCount: number, usePwd: boolean, pwd: string) => void;
}

export default function ChatroomCreateForm({ onSubmit }: ChatroomCreateFormProps) {  
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const roomName = formData.get('roomName') as string || '';
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
    onSubmit(roomName, maxUserCount, usePwd, pwd);
  };

  return (
    <form className="p-8 w-144 space-y-8 bg-white rounded-xl" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-primary font-bold">방 만들기</h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold">제목</h3>
          <input
            type="text"
            name="roomName"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="제목"
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">접속인원</h3>
          <select name="maxUserCount" className="border px-4 h-16 w-full bg-gray-100 rounded-full">
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
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">암호</h3>
          <div className="flex gap-4">
            <input type="checkbox" name="usePwd" />
            <input
              type="text"
              name="pwdConfirm"
              className="border px-4 h-16 w-full bg-gray-100 rounded-full"
              placeholder="암호"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-9">
        <Link
          href="/"
          className="w-full px-4 h-16 leading-16 border bg-gray-100 text-center rounded-full"
        >
          취소
        </Link>
        <button
          type="submit"
          className="w-full px-4 h-16 border bg-primary text-white rounded-full"
        >
          방 만들기
        </button>
      </div>
    </form>
  );
}

