"use client";

import TestSidebar from "@/src/components/sidebars/TestSidebars";
import { userCheckNickname, userCreate, userDelete, userInfo, userUpdate, userValidate } from "@/src/lib/auth";
import { act, FormEvent, useState } from "react";

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

  const handleSubmit = async (e: FormEvent, actionName: string) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const user = {
      id: formData.get('id') as string,
      pwd: formData.get('pwd') as string,
      confirmPwd: formData.get('confirmPwd') as string,
      usePwd: formData.get('usePwd') as string,
      nick_name: formData.get('nick_name') as string,
      name: formData.get('name') as string,
    };

    const userActions: {[key: string]: () => any} = {
      'userCreate': async () => await userCreate(user),
      'userUpdate': async () => await userUpdate(user),
      'userDelete': async () => await userDelete(user.id),
      'userInfo': async () => await userInfo(user.id, user.pwd),
      'userCheckNickname': async () => await userCheckNickname(user.nick_name),
      'userValidate': async () => await userValidate(user.id),
    };

    const response = await (userActions[actionName] || (() => { }))();
    console.log(response);
    formData.set('result', JSON.stringify(response));
  }

  return (
    <div className="flex gap-4 px-4 pt-24 pb-4 w-full h-full bg-gray-200">
      <TestSidebar onChange={handleChange} />
      {state.userCreate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 생성</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e, 'userCreate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="pwd" placeholder="비밀번호" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="confirmPwd" placeholder="비밀번호확인" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="usePwd" placeholder="비밀번호사용여부" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="nick_name" placeholder="닉네임" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="name" placeholder="이름" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">생성</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.userUpdate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 변경</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e, 'userUpdate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="pwd" placeholder="비밀번호" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="confirmPwd" placeholder="비밀번호확인" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="nick_name" placeholder="닉네임" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="name" placeholder="이름" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">변경</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.userDelete.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 삭제</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e, 'userDelete')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
                <input type="text" name="pwd" placeholder="비밀번호" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">삭제</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.userInfo.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">사용자 조회</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e, 'userInfo')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">조회</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none"></textarea>
            </div>
          </form>
        </div>
      )}
      {state.userCheckNickname.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">닉네임 중복</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e, 'userCheckNickname')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="nick_name" placeholder="닉네임" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">확인</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.userValidate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">이메일 중복</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e, 'userValidate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 text-lg text-gray-700 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-lg text-white bg-blue-400 rounded-lg">확인</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.chatroomCreateSession.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">세션 생성</h1>
          </div>
          <form className="flex justify-center gap-8 w-full h-full">
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
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.chatroomCreateToken.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-gray-700 text-[40px] font-semibold">토큰 생성</h1>
          </div>
          <form className="flex justify-center gap-8 w-full h-full">
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
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
