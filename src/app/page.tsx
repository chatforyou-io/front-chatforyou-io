"use client";

import { useEffect, useState } from "react";
import UsersBar from "@/src/components/bars/UsersBar";
import ChatroomCard from "@/src/components/cards/ChatroomCard";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import Modal from "@/src/components/items/Modal";
import { useSession } from "@/src/contexts/SessionContext";
import IconPlus from "@/public/images/icons/plus.svg";
import { chatroomList } from "@/src/libs/chatroom";
import { connectChatroomListSSE } from "@/src/libs/sses/chatroomList";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";

export default function Home() {
  const { user } = useSession();
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const handleRequestFail = useHandleRequestFail();

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const data = await chatroomList();
        if (!data.isSuccess) throw new Error(handleRequestFail(data));
  
        setChatrooms(data.roomList || []);
      } catch (error) {
        console.error("Failed to fetch chatrooms:", error);
      }
    };

    fetchChatrooms();
  }, [handleRequestFail]);

  useEffect(() => {
    if (!user?.idx) return;

    const eventSource = connectChatroomListSSE(user.idx, {
      onConnectionStatus: (status) => console.log(status),
      onKeepAlive: (message) => console.log(message),
      onUpdateChatroomList: (data) => setChatrooms(data.chatrooms),
      onError: (error) => console.warn(error),
    });

    return () => {
      eventSource.close();
      console.warn("Disconnected");
    };
  }, [user?.idx]);

  return (
    <>
      <main className="flex flex-col items-center size-full bg-gray-200">
        <div className="flex flex-shrink-0 justify-between lg:justify-between items-center lg:px-4 py-4 w-sm md:w-full bg-gray-200">
          <div className="hidden lg:inline-block justify-center items-center px-4 w-40">
            <h1 className="text-2xl font-bold">대시보드</h1>
          </div>
          <div className="flex gap-4 justify-center lg:justify-end w-sm md:w-full">
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
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start lg:px-4 w-sm md:w-full h-full">
          <UsersBar />
          <div className="flex justify-center size-full pt-4 lg:p-0 overflow-y-auto">
            {chatrooms.length === 0
              ? <div className="flex justify-center items-center size-full"><p>채팅방이 존재하지 않습니다.</p></div>
              : (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
                  {chatrooms.map((chatroom, index) => <ChatroomCard key={index} chatroom={chatroom} />)}
                </div>
              )}
          </div>
        </div>
      </main>
      <Modal isOpen={isPopup} onClose={() => setIsPopup(false)}>
        <ChatroomCreateForm onClose={() => setIsPopup(false)} />
      </Modal>
    </>
  );
}
