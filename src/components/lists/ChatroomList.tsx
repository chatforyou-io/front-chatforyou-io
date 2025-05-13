"use client";

import { useState, useEffect } from "react";
import ChatroomCard from "@/src/components/cards/ChatroomCard";
import { useSession } from "@/src/contexts/SessionContext";
import { chatroomList } from "@/src/libs/chatroom";
import { connectChatroomListSSE } from "@/src/libs/sses/chatroomList";
import IconLoader from "@/public/images/icons/loader.svg";

export default function ChatroomList() {
  const { user } = useSession();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 채팅방 목록 조회
  useEffect(() => {
    if (!user?.idx) return;

    const fetchChatrooms = async () => {
      setIsLoading(true);

      try {
        const { isSuccess, roomList } = await chatroomList();
  
        if (!isSuccess) {
          throw new Error("채팅방 목록 조회 실패");
        }
  
        setChatrooms(roomList);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchChatrooms();
  }, [user?.idx]);

  // SSE 연결
  useEffect(() => {
    if (!user?.idx) return;

    const eventSource = connectChatroomListSSE(user.idx, {
      onUpdateChatroomList: (chatrooms) => setChatrooms(chatrooms)
    });

    return () => {
      eventSource.close();
    };
  }, [user?.idx]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center size-full">
        <IconLoader className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {chatrooms.length === 0 ? (
        <div className="flex justify-center items-center size-full">
          <p className="text-gray-500">채팅방이 존재하지 않습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
          {chatrooms.map((chatroom, index) => (
            <div key={index} className="w-sm md:w-78 h-52 space-y-4 bg-white rounded-2xl shadow-xl">
              <ChatroomCard chatroom={chatroom} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
