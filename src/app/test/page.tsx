"use client";

import TestSidebar from "@/src/components/sidebars/TestSidebars";
import Link from "next/link";
import { useState } from "react";

interface TestSidebarState {
  userCreate: { title: string; isActivated: boolean; };
  userUpdate: { title: string; isActivated: boolean; };
  userDelete: { title: string; isActivated: boolean; };
  userInfo: { title: string; isActivated: boolean; };
  userCheckNickname: { title: string; isActivated: boolean; };
  userValidate: { title: string; isActivated: boolean; };
  chatroomCreateSession: { title: string; isActivated: boolean; };
  chatroomCreateToken: { title: string; isActivated: boolean; };
}

export default function Page() {
  const [state, setState] = useState<TestSidebarState>({
    userCreate: { title: "사용자 생성", isActivated: false },
    userUpdate: { title: "사용자 변경", isActivated: false },
    userDelete: { title: "사용자 삭제", isActivated: false },
    userInfo: { title: "사용자 조회", isActivated: false },
    userCheckNickname: { title: "닉네임 중복", isActivated: false },
    userValidate: { title: "이메일 중복", isActivated: false },
    chatroomCreateSession: { title: "세션 생성", isActivated: false },
    chatroomCreateToken: { title: "토큰 생성", isActivated: false },
  });
  
  const handleChange = (newState: TestSidebarState) => {
    setState((prevState) => ({
      ...newState,
    }));
  };

  return (
    <div className="flex gap-4 px-4 pt-24 pb-4 w-full h-full bg-gray-200">
      <TestSidebar onChange={handleChange} />
      {state.userCreate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 생성</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호확인" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호사용여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="닉네임" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="이름" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">생성</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.userUpdate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 변경</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호확인" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="닉네임" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="이름" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">변경</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.userDelete.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 삭제</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">삭제</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.userInfo.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 조회</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">조회</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.userCheckNickname.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">닉네임 중복</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="닉네임" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">확인</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.userValidate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">이메일 중복</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">확인</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.chatroomCreateSession.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">세션 생성</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이름" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="생성자" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호설정여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비공개여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="RTC사용여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="최대인원" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">생성</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
      {state.chatroomCreateToken.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">토큰 생성</h1>
          </div>
          <div className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" placeholder="이름" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="생성자" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비밀번호설정여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="비공개여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="RTC사용여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="현재인원" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="최대인원" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">생성</button>
            </div>
            <div className="flex w-96">
              <textarea className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
