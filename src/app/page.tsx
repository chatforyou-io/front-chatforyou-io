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
      <main className="flex pt-20 size-full bg-gray-200">
        <DashboardSidebar />
        <div className="flex flex-col lg:flex-row gap-4 size-full">
          <div className="lg:p-4 size-full space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">대시보드</h1>
              </div>
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
                  onClick={() => setIsPopup(true)}>
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
      </main>
      <Modal isOpen={isPopup} onClose={() => setIsPopup(false)}>
        <ChatroomCreateForm onClose={() => setIsPopup(false)} />
      </Modal>
    </>
  );
}
