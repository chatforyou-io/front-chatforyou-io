"use client";

import ChatroomCard from "@/src/components/cards/ChatroomCard";
import NormalInput from "@/src/components/inputs/NormalInput";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { chatroomList } from "@/src/lib/chatroom";
import Header from "@/src/components/Header";

export default function Home() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/chatroom/write");
  }
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  const fetchChatrooms = async () => {
    try {
      const response = await chatroomList();
      setChatrooms(response.result);
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
    }
  };

  useEffect(() => {
    fetchChatrooms();
  }, []);

  return (

    <main className="h-full bg-white">
      <Header />
      <div className="flex gap-12 pt-24 pb-4 px-4 h-full bg-gray-200">
        <div className="px-3 py-6 w-60 h-full bg-white rounded">
          <h3 className="font-semibold text-gray-800">Quantum Dynamics</h3>
        </div>
        <div className="p-6 w-full h-full space-y-5 overflow-y-scroll">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex justify-between">
            <div className="flex mt-4 space-x-4">
              <p>Room List</p>
              <p>Overview</p>
              <p>Search</p>
              <p>Account</p>
            </div>
            <div className="flex gap-3">
              <NormalInput type="text" name="keyword" placeholder="Search" />
              <PrimaryButton type="button" onClick={handleClick} label="Create Room" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 w-full h-full">
            {chatrooms?.map((chatroom, index) => (
              <ChatroomCard key={index} chatroom={chatroom} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
