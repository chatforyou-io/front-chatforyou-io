"use client";

import { FC, useState } from 'react';

interface TestSidebarProps {
  onChange?: (state: TestSidebarState) => void;
}

interface TestSidebarState {
  userCreate: { title: string; isActivated: boolean; };
  userUpdate: { title: string; isActivated: boolean; };
  userDelete: { title: string; isActivated: boolean; };
  userInfo: { title: string; isActivated: boolean; };
  userCheckNickname: { title: string; isActivated: boolean; };
  userValidate: { title: string; isActivated: boolean; };
  chatroomCreate: { title: string; isActivated: boolean; };
  chatroomList: { title: string; isActivated: boolean; };
}

const TestSidebar: FC<TestSidebarProps> = ({ onChange }) => {
  const [state, setState] = useState<TestSidebarState>({
    userCreate: { title: "사용자 생성", isActivated: false },
    userUpdate: { title: "사용자 변경", isActivated: false },
    userDelete: { title: "사용자 삭제", isActivated: false },
    userInfo: { title: "사용자 조회", isActivated: false },
    userCheckNickname: { title: "닉네임 중복", isActivated: false },
    userValidate: { title: "이메일 중복", isActivated: false },
    chatroomCreate: { title: "세션 생성", isActivated: false },
    chatroomList: { title: "토큰 생성", isActivated: false },
  });

  const handleClick = (key: keyof TestSidebarState) => {
    const newState = state;

    Object.keys(newState).forEach((key) => {
      const userKey = key as keyof TestSidebarState;
      newState[userKey].isActivated = false;
    });
    newState[key].isActivated = !newState[key].isActivated;

    setState(newState);
    
    if (onChange) {
      onChange(newState);
    }
  };
  
  return (
    <div className="px-3 py-6 w-60 h-full space-y-8 bg-white rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-800">테스트</h2>
      <div className="space-y-6">
        <h3 className="">사용자 관련</h3>
        <div className="flex flex-col space-y-4">
          <button onClick={() => handleClick('userCreate')} className="text-left">사용자 생성</button>
          <button onClick={() => handleClick('userUpdate')} className="text-left">사용자 변경</button>
          <button onClick={() => handleClick('userDelete')} className="text-left">사용자 삭제</button>
          <button onClick={() => handleClick('userInfo')} className="text-left">사용자 조회</button>
          <button onClick={() => handleClick('userCheckNickname')} className="text-left">닉네임 중복</button>
          <button onClick={() => handleClick('userValidate')} className="text-left">이메일 중복</button>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="">방 관련</h3>
        <div className="flex flex-col space-y-4">
          <button onClick={() => handleClick('chatroomCreate')} className="text-left">채팅방 생성</button>
          <button onClick={() => handleClick('chatroomList')} className="text-left">채팅방 목록</button>
        </div>
      </div>
    </div>
  );
};

export default TestSidebar;