"use client";

import Header from "@/src/components/Header";
import ChatroomCard from "../components/cards/ChatroomCard";
import NormalInput from "../components/inputs/NormalInput";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/chatroom/write");
  }

  return (
    <main className="flex flex-col items-center justify-center h-full bg-white transition-colors duration-500">
      <Header />
      <div className="flex gap-12 mt-20 p-6 w-full h-full bg-gray-200">
        <div className="mt-8 px-3 py-6 w-60 h-full bg-white rounded">
          <h3 className="font-semibold text-gray-800">Quantum Dynamics</h3>
        </div>
        <div className="mt-8 p-6 w-full h-full space-y-5 overflow-y-scroll">
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
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
            <ChatroomCard />
          </div>
        </div>
      </div>
    </main>
  );
}
