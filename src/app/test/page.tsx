"use client";

import TestSidebar from "@/src/components/sidebars/TestSidebars";
import { userCheckNickname, userCreate, userDelete, userInfo, userUpdate, userValidate } from "@/src/libs/user";
import { chatroomCreate, chatroomList } from "@/src/libs/chatroom";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

interface TestSidebarState {
  userCreate: { title: string; isActivated: boolean; };
  userUpdate: { title: string; isActivated: boolean; };
  userDelete: { title: string; isActivated: boolean; };
  userInfo: { title: string; isActivated: boolean; };
  userCheckNickname: { title: string; isActivated: boolean; };
  userValidate: { title: string; isActivated: boolean; };
  chatroomCreate: { title: string; isActivated: boolean; };
  chatroomJoin: { title: string; isActivated: boolean; };
  chatroomList: { title: string; isActivated: boolean; };
}

export default function Page() {
  const { data: userSession, status } = useSession();
  const [state, setState] = useState<TestSidebarState>({
    userCreate: { title: "사용자 생성", isActivated: false },
    userUpdate: { title: "사용자 변경", isActivated: false },
    userDelete: { title: "사용자 삭제", isActivated: false },
    userInfo: { title: "사용자 조회", isActivated: false },
    userCheckNickname: { title: "닉네임 중복", isActivated: false },
    userValidate: { title: "이메일 중복", isActivated: false },
    chatroomCreate: { title: "세션 생성", isActivated: false },
    chatroomJoin: { title: "세션 참여", isActivated: false },
    chatroomList: { title: "토큰 생성", isActivated: false },
  });
  
  const handleChange = (newState: TestSidebarState) => {
    setState((prevState) => ({
      ...newState,
    }));
  };

  const handleUserSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const user = {
      id: formData.get('id') as string,
      confirmPwd: formData.get('confirmPwd') as string,
      usePwd: true,
      nickName: formData.get('nickName') as string,
      roomName: formData.get('name') as string,
    };

    const actions: {[key: string]: (user: User) => any} = {
      'userCreate': async (user: User) => await userCreate(user),
      'userUpdate': async (user: User) => await userUpdate(user),
      'userDelete': async (user: User) => await userDelete(user.id, user.pwd ?? ''),
      'userInfo': async (user: User) => await userInfo(user.id, user.pwd ?? ''),
      'userCheckNickname': async (user: User) => await userCheckNickname(user.nickName ?? ''),
      'userValidate': async (user: User) => await userValidate(user.id),
    };

    const response = await (actions[action] || (() => {}))(user);
    const resultTextarea = form.querySelector('textarea[name="result"]')!;
    resultTextarea.innerHTML = JSON.stringify(response);
  }

  const handleChatroomSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const chatroom = {
      userIdx: userSession!.user.idx as number,
      roomName: formData.get('roomName') as string || '',
      maxUserCount: parseInt(formData.get('maxUserCount') as string) || 0,
      usePwd: false,
      pwd: '',
    };

    const actions: {[key: string]: (chatroom: Chatroom) => any} = {
      'chatroomCreate': async (chatroom: Chatroom) => await chatroomCreate(chatroom),
      //'chatroomJoin': async (chatroom: Chatroom) => await chatroomJoin(chatroom),
      'chatroomList': async (chatroom: Chatroom) => await chatroomList(),
    };

    const response = await (actions[action] || (() => {}))(chatroom);
    const resultTextarea = form.querySelector('textarea[name="result"]')!;
    resultTextarea.innerHTML = JSON.stringify(response);
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/login';
    }
  }, [status]);

  return (
    <div className="flex gap-4 px-4 pt-24 pb-4 w-full h-full bg-gray-200">
      <TestSidebar onChange={handleChange} />
      {state.userCreate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-[40px] font-semibold">사용자 생성</h1>
          </div>
          <form onSubmit={(e) => handleUserSubmit(e, 'userCreate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="pwd" placeholder="비밀번호" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="confirmPwd" placeholder="비밀번호확인" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="nickName" placeholder="닉네임" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="roomName" placeholder="이름" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">생성</button>
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
            <h1 className="text-[40px] font-semibold">사용자 변경</h1>
          </div>
          <form onSubmit={(e) => handleUserSubmit(e, 'userUpdate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="pwd" placeholder="비밀번호" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="confirmPwd" placeholder="비밀번호확인" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="nickName" placeholder="닉네임" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="name" placeholder="이름" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">변경</button>
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
            <h1 className="text-[40px] font-semibold">사용자 삭제</h1>
          </div>
          <form onSubmit={(e) => handleUserSubmit(e, 'userDelete')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="pwd" placeholder="비밀번호" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">삭제</button>
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
            <h1 className="text-[40px] font-semibold">사용자 조회</h1>
          </div>
          <form onSubmit={(e) => handleUserSubmit(e, 'userInfo')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">조회</button>
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
            <h1 className="text-[40px] font-semibold">닉네임 중복</h1>
          </div>
          <form onSubmit={(e) => handleUserSubmit(e, 'userCheckNickname')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="nickName" placeholder="닉네임" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">확인</button>
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
            <h1 className="text-[40px] font-semibold">이메일 중복</h1>
          </div>
          <form onSubmit={(e) => handleUserSubmit(e, 'userValidate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="id" placeholder="이메일" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">확인</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.chatroomCreate.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-[40px] font-semibold">세션 생성</h1>
          </div>
          <form onSubmit={(e) => handleChatroomSubmit(e, 'chatroomCreate')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                <input type="text" name="roomName" placeholder="방 이름" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
                <input type="text" name="maxUserCount" placeholder="최대인원" className="w-96 h-12 px-4 border border-gray-300 rounded-lg" />
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">생성</button>
            </div>
            <div className="flex w-96">
              <textarea name="result" className="border p-4 w-full resize-none" readOnly></textarea>
            </div>
          </form>
        </div>
      )}
      {state.chatroomList.isActivated && (
        <div className="flex flex-col p-12 w-full h-full space-y-12 bg-white rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-[40px] font-semibold">토큰 생성</h1>
          </div>
          <form onSubmit={(e) => handleChatroomSubmit(e, 'chatroomList')} className="flex justify-center gap-8 w-full h-full">
            <div className="flex flex-col justify-between w-96 h-full">
              <div className="space-y-4">
                No Input
              </div>
              <button className="w-96 h-12 text-white bg-blue-400 rounded-lg">생성</button>
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
