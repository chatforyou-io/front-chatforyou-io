"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { z } from "zod";
import Header from "@/src/components/Header";
import Modal from "@/src/components/Modal";
import UsersBar from "@/src/components/bars/UsersBar";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import ChatroomList from "@/src/components/lists/ChatroomList";
import { useSession } from "@/src/contexts/SessionContext";
import { chatroomList } from "@/src/libs/chatroom";
import { connectChatroomListSSE } from "@/src/libs/sses/chatroomList";

export default function Home() {
  const { user } = useSession();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [isPopup, setIsPopup] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pageNum = 1;
  const [pageSize, setPageSize] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const updateKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keywordSchema = z.string().min(2, "검색어는 최소 2자 이상이어야 합니다.");
    
    const inputKeyword = e.currentTarget.value;
    if (inputKeyword.length === 0) {
      setKeyword("");
      setError(null);
      return;
    }

    const validation = keywordSchema.safeParse(inputKeyword);
    if (validation.success) {
      setKeyword(inputKeyword);
      setError(null);
    } else {
      console.error(validation.error.errors[0].message);
      setError(validation.error.errors[0].message);
    }
  };
  const increasePageSize = () => setPageSize((prev) => prev + 1);
  const togglePopup = () => setIsPopup((prev) => !prev);

  useEffect(() => {
    if (!user?.idx) return;

    // 채팅방 목록 조회
    const fetchChatrooms = async () => {
      try {
        const { isSuccess, roomList, totalCount } = await chatroomList(keyword, pageNum, pageSize);
  
        if (!isSuccess) {
          throw new Error("채팅방 목록 조회 실패");
        }
        
        setChatrooms(roomList);
        setTotalCount(totalCount);
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
  }, [keyword, pageNum, pageSize, user]);
  
  return (
    <div className="flex flex-col justify-start items-center size-full bg-white md:bg-gray-200">
      <Header />
      <main className="flex flex-row-reverse justify-start w-md md:w-full h-full bg-white md:bg-gray-200">
        <div className="flex flex-col items-center md:items-start md:pl-48 w-md md:w-full h-full">
          <div className="p-4 w-md md:w-full">
            <input
              type="text"
              name="keyword"
              className="border px-4 h-16 w-full md:w-128 bg-white rounded-full focus:ring focus:ring-primary"
              placeholder="검색"
              onKeyUp={updateKeyword}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="flex items-start size-full pt-4 px-4 overflow-y-auto">
            <ChatroomList
              chatrooms={chatrooms}
              toggleChatroomCreateForm={togglePopup}
            />
          </div>
          <div className="w-full h-16">
            <button
              onClick={increasePageSize}
              disabled={pageNum * pageSize >= totalCount}
              className={clsx("w-full h-full bg-primary text-white rounded-md hover:bg-blue-300 transition-colors", {
                "hidden": pageNum * pageSize >= totalCount,
              })}
            >   
              더 보기
            </button>
          </div>
        </div>
        <div className="absolute left-0 h-full bg-white">
          <UsersBar />
        </div>
        <Modal isOpen={isPopup} onClose={togglePopup}>
          <ChatroomCreateForm onClose={togglePopup} />
        </Modal>
      </main>
    </div>
  );
}
