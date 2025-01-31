"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/src/components/Header";
import ChatroomCard from "@/src/components/cards/ChatroomCard";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import DashboardSidebar from "@/src/components/sidebars/DashboardSidebar";
import { chatroomList } from "@/src/libs/chatroom";
import chatroomMocks from "@/src/mocks/chatrooms.json";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconPlus from "@/public/images/icons/plus.svg";

export default function Home() {
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>(chatroomMocks);
  const handleRequestFail = useHandleRequestFail();

  const fetchChatrooms = useCallback(async () => {
    try {
      const data = await chatroomList();
      if (!data.isSuccess) {
        const message = handleRequestFail(data);
        throw new Error(message);
      }

      const newChatrooms = [ ...chatroomMocks, ...(data.roomList || []) ];
      setChatrooms(newChatrooms);
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
    }
  }, [handleRequestFail]);

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
                className="flex justify-center items-center w-full px-4 h-16 border bg-primary text-white rounded-full"
                onClick={() => setIsPopup(true)}
              >
                <IconPlus aria-label="plus" width={24} height={24} />
                <span className="hidden sm:inline-block">방 만들기</span>
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
            <ChatroomCreateForm onClose={() => setIsPopup(false)} />
          </div>
        </>
      }
    </main>
  );
}
