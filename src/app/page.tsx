"use client";

import { useState, useEffect, useCallback } from "react";
import ChatroomCard from "@/src/components/cards/ChatroomCard";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import DashboardSidebar from "@/src/components/sidebars/DashboardSidebar";
import { chatroomList } from "@/src/libs/chatroom";
import chatroomMocks from "@/src/mocks/chatrooms.json";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconPlus from "@/public/images/icons/plus.svg";
import Modal from "@/src/components/Modal";

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
    <>
      <main className="flex flex-col size-full bg-gray-200">
        <div className="flex flex-shrink-0 justify-between lg:justify-between items-center p-4 w-full bg-gray-200">
          <div className="hidden lg:inline-block justify-center items-center w-40">
            <h1 className="text-2xl font-bold">대시보드</h1>
          </div>
          <div className="flex gap-4 justify-center w-full">
            <input
              type="text"
              name="keyword"
              className="border px-4 h-16 w-full md:w-128 bg-white rounded-full"
              placeholder="검색" />
            <button
              type="button"
              className="flex justify-center items-center w-24 lg:w-full lg:max-w-44 px-4 h-16 border bg-primary text-white rounded-full"
              onClick={() => setIsPopup(true)}>
              <IconPlus aria-label="plus" width={24} height={24} />
              <span className="hidden lg:inline-block">방 만들기</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center size-full">
          <DashboardSidebar />
          <div className="flex justify-center size-full pt-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto px-4">
              {chatrooms.length
                ? chatrooms.map((chatroom, index) => <ChatroomCard key={index} chatroom={chatroom} />)
                : <p>채팅방이 존재하지 않습니다.</p>}
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={isPopup} onClose={() => setIsPopup(false)}>
        <ChatroomCreateForm onClose={() => setIsPopup(false)} />
      </Modal>
    </>
  );
}
