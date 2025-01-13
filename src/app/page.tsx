"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/src/components/Header";
import ChatroomCard from "@/src/components/cards/ChatroomCard";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import DashboardSidebar from "@/src/components/sidebars/DashboardSidebar";
import { chatroomCreate, chatroomList } from "@/src/libs/chatroom";
import chatroomMocks from "@/src/mocks/chatrooms.json";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>(chatroomMocks);

  const fetchChatrooms = useCallback(async () => {
    try {
      const response = await chatroomList();
      setChatrooms([ ...chatrooms, ...(response.roomList || []) ]);
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
    }
  }, []);
  
  const handleCreateRoom = useCallback(async (roomName: string, maxUserCount: number, usePwd: boolean, pwd: string) => {
    try {
      if (!session) throw new Error('로그인이 필요합니다.');

      const chatroom: Chatroom = { roomName, maxUserCount, usePwd, pwd, userIdx: session.user.idx };
      const data = await chatroomCreate(chatroom);
      if (!data.isSuccess) {
        throw new Error('방 생성 중 오류가 발생했습니다.');
      }

      alert('방이 생성되었습니다.');
      router.push(`/chatroom/view/${data.roomData.sessionId}`);
    } catch (error) {
      console.error(error);
      alert('방 생성 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  }, [session, router]);

  useEffect(() => {
    fetchChatrooms();
  }, [fetchChatrooms]);

  return (
    <main className="size-full bg-white">
      <Header />
      <div className="flex space-x-4 pt-24 pb-4 px-4 size-full bg-gray-200 overflow-y-auto">
        <DashboardSidebar />
        <div className="p-8 size-full space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">대시보드</h1>
            <div className="flex gap-3">
              <input
                type="text"
                name="keyword"
                className="border px-4 h-16 w-full bg-white rounded-full"
                placeholder="검색"
              />
              <button
                type="button"
                className="w-full px-4 h-16 border bg-primary text-white rounded-full"
                onClick={() => setIsPopup(true)}
              >
                방 만들기
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 size-fit">
            {chatrooms && chatrooms.length === 0 && <p>채팅방이 존재하지 않습니다.</p>}
            {chatrooms && chatrooms.map((chatroom, index) => {
              return (
              <ChatroomCard key={index} chatroom={chatroom} />
            )})}
          </div>
        </div>
      </div>
      {isPopup &&
        <>
          <div className="absolute top-0 left-0 flex-center size-full bg-black opacity-50"></div>
          <div className="absolute top-0 left-0 flex-center size-full">
            <ChatroomCreateForm onSubmit={handleCreateRoom} onClose={() => setIsPopup(false)} />
          </div>
        </>
      }
    </main>
  );
}
