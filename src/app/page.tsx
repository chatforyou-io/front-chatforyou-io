"use client";

import { useState, useEffect } from "react";
import ChatroomCreateBar from "@/src/components/bars/ChatroomCreateBar";
import UsersBar from "@/src/components/bars/UsersBar";
import Header from "@/src/components/items/Header";
import ChatroomList from "@/src/components/lists/ChatroomList";
import { useSession } from "@/src/contexts/SessionContext";
import { chatroomList } from "@/src/libs/chatroom";
import { connectChatroomListSSE } from "@/src/libs/sses/chatroomList";

export default function Home() {
  const { user } = useSession();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  useEffect(() => {
    if (!user?.idx) return;

    // 채팅방 목록 조회
    const fetchChatrooms = async () => {
      try {
        const { isSuccess, roomList } = await chatroomList();
  
        if (!isSuccess) {
          throw new Error("채팅방 목록 조회 실패");
        }
  
        setChatrooms(roomList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatrooms();
    
    // SSE 연결
    const eventSource = connectChatroomListSSE(user.idx, {
      onUpdateChatroomList: (chatrooms) => setChatrooms(chatrooms)
    });
    return () => {
      eventSource.close();
    };
  }, [user?.idx]);
  
  return (
    <div className="flex flex-col justify-start items-center size-full bg-white md:bg-gray-200">
      <Header />
      <main className="flex flex-row-reverse justify-start w-md md:w-full h-full bg-white md:bg-gray-200">
        <div className="flex flex-col items-center md:items-start md:pl-48 w-md md:w-full h-full">
          <div className="p-4 w-md md:w-full">
            <ChatroomCreateBar />
          </div>
          <div className="flex items-start size-full pt-4 px-4 overflow-y-auto">
            <ChatroomList chatrooms={chatrooms} />
          </div>
        </div>
        <div className="absolute left-0 h-full bg-white">
          <UsersBar />
        </div>
      </main>
    </div>
  );
}
