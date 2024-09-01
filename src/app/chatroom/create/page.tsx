"use client";

import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import { chatroomCreate } from "@/src/libs/chatroom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const handleSubmit = async (roomName: string, description: string, maxUserCount: number, usePwd: boolean, pwd: string) => {
    try {
      if (!session) throw new Error('로그인이 필요합니다.');

      const chatroom: Chatroom = { roomName, description, maxUserCount, usePwd, pwd, userIdx: session.user.idx };
      const data = await chatroomCreate(chatroom);
      if (!data.isSuccess) {
        throw new Error('방 생성 중 오류가 발생했습니다.');
      }

      alert('방이 생성되었습니다.')
      const sessionId = data.roomData.sessionId;
      router.push(`/chatroom/view/${sessionId}`);
    } catch (error) {
      console.error(error);
      alert('방 생성 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  }

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [status]);
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center p-12 w-full max-w-xl bg-white rounded-3xl">
        <h1 className="text-primary-normal text-[40px] font-semibold">New Room</h1>
        <div className="mt-12 w-full">
          <ChatroomCreateForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
