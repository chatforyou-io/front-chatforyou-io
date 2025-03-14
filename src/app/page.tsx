"use client";

import { useState, useEffect } from "react";
import UsersBar from "@/src/components/bars/UsersBar";
import ChatroomCard from "@/src/components/cards/ChatroomCard";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import Modal from "@/src/components/items/Modal";
import IconPlus from "@/public/images/icons/plus.svg";
import { connectChatroomListSSE } from "../libs/sses/chatroomList";
import { useSession } from "@/src/contexts/SessionContext";

export default function Home() {
  const { user } = useSession();
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");

  useEffect(() => {
    if (!user?.idx) return;

    const eventSource = connectChatroomListSSE(user.idx, {
      onConnectionStatus: (status) => {
        setConnectionStatus(status);
        console.log("connectionStatus:", status);
      },
      onKeepAlive: (message) => {
        console.log("keep alive:", message);
        setConnectionStatus("Connected");
      },
      onUpdateChatroomList: (chatrooms) => {
        setChatrooms(chatrooms);
        setConnectionStatus("Connected");
        console.log("chatrooms:", chatrooms);
      },
      onError: (error) => {
        console.error("Error:", error);
        setConnectionStatus("Disconnected");
      },
    });

    return () => {
      eventSource.close();
      setConnectionStatus("Disconnected");
    };
  }, [user?.idx]);

  useEffect(() => {
    console.log("connectionStatus:", connectionStatus);
  }, [connectionStatus]);

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
            {chatrooms.length
              ? (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
                  {chatrooms.map((chatroom, index) => <ChatroomCard key={index} chatroom={chatroom} />)}
                </div>)
              : <div className="flex justify-center items-center size-full"><p>채팅방이 존재하지 않습니다.</p></div>}
          </div>
        </div>
      </main>
      <Modal isOpen={isPopup} onClose={() => setIsPopup(false)}>
        <ChatroomCreateForm onClose={() => setIsPopup(false)} />
      </Modal>
    </>
  );
}
