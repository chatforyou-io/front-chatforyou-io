"use client";

import { FC, useState } from 'react';

interface TestSidebarProps {
  onChange?: (state: TestSidebarState) => void;
}

interface TestSidebarState {
  user: boolean;
  chatroom: boolean;
}

const TestSidebar: FC<TestSidebarProps> = ({ onChange }) => {
  const [state, setState] = useState<TestSidebarState>({ user: false, chatroom: false });

  const handleToggle = (key: keyof TestSidebarState) => {
    const newState = { ...state, [key]: !state[key] };
    setState(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className="m-4 px-3 py-6 w-60 h-full space-y-8 bg-white rounded">
      <h3 className="font-semibold text-gray-800">테스트</h3>
      <div className="space-y-6">
        <button onClick={() => handleToggle('user')} className="">사용자 관련</button>
        {state.user && (
          <div className="flex flex-col space-y-4">
            <button className="text-left">사용자 생성</button>
            <button className="text-left">사용자 변경</button>
            <button className="text-left">사용자 삭제</button>
            <button className="text-left">사용자 조회</button>
            <button className="text-left">닉네임 중복</button>
            <button className="text-left">이메일 중복</button>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <button onClick={() => handleToggle('chatroom')} className="">방 관련</button>
        {state.chatroom && (
          <div className="flex flex-col space-y-4">
            <button className="text-left">세션 생성</button>
            <button className="text-left">토큰 생성</button>
            <button className="text-left">방 접속</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSidebar;