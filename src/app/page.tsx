"use client";

import ChatroomCard from "@/src/components/cards/ChatroomCard";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { chatroomList } from "@/src/libs/chatroom";
import Header from "@/src/components/Header";
import { useSession } from "next-auth/react";
import DashboardSidebar from "../components/sidebars/DashboardSidebar";

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  const {data: session, status} = useSession();
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/chatroom/create");
  }
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  const fetchChatrooms = async () => {
    try {
      const response = await chatroomList();
      setChatrooms(response.roomList);
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") {
      router.push(`${basePath}/auth/login`);
    }

    fetchChatrooms();
  }, [basePath, router, status]);

  return (

    <main className="h-full bg-white">
      <Header />
      <div className="flex gap-12 pt-24 pb-4 px-4 h-full bg-gray-200">
        <DashboardSidebar />
        <div className="p-6 w-full min-w-[800px] h-full space-y-5 overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
            <div className="flex gap-3">
              <input
                type="text"
                name="keyword"
                className="border px-6 py-4 w-full bg-white rounded-full"
                placeholder="검색"
              />
              <PrimaryButton type="button" onClick={handleClick} label="방 만들기" />
            </div>
          </div>
          <div className="flex gap-8 w-full h-full">
            {chatrooms && chatrooms.length === 0 && <p>채팅방이 존재하지 않습니다.</p>}
            {chatrooms && chatrooms.map((chatroom, index) => {
              return (
              <ChatroomCard key={index} chatroom={chatroom} />
            )})}
          </div>
        </div>
      </div>
    </main>
  );
}
