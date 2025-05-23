"use client";

import { useEffect, useState } from "react";
import IconLoader from "@/public/images/icons/loader.svg";
import { chatroomToken } from "@/src/libs/chatroom";
import Header from "@/src/components/Header";
import { useSession } from "@/src/contexts/SessionContext";
import { connectChatroomInfoSSE } from "@/src/libs/sses/chatroomInfo";
import OpenViduCard from "@/src/components/openvidu/OpenViduCard";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params: { sessionId } }: PageProps) {
  const { user } = useSession();
  const router = useRouter();

  const [chatroom, setChatroom] = useState<Chatroom>();
  const [token, setToken] = useState<string>("");

  

  useEffect(() => {
    if (!user?.idx) return;
  
    // 채팅방 생성일자 포맷팅
    const formatDateTime = (date: string) => new Date(date).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

    // 채팅방 토큰 발급
    const fetchChatroom = async () => {
      try {
        const { isSuccess, roomInfo, joinUserInfo } = await chatroomToken(sessionId, user.idx);
  
        if (!isSuccess) {
          throw new Error("채팅방 토큰 발급 실패");
        }
  
        // 채팅방 생성일자 포맷팅
        const createDatetime = formatDateTime(roomInfo.createDate);
        setChatroom({ ...roomInfo, createDatetime });
        setToken(joinUserInfo.camera_token);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchChatroom();

    // SSE 연결
    const eventSource = connectChatroomInfoSSE(sessionId, user.idx, {
      onUpdateChatroomInfo: (chatroom) => setChatroom({ ...chatroom, createDatetime: chatroom.createDate ? formatDateTime(chatroom.createDate) : undefined })
    });

    return () => {
      eventSource.close();
    };
  }, [router, sessionId, user?.idx]);

  if (!chatroom) {
    return (
      <div className="flex flex-col justify-center items-center size-full bg-gray-200">
        <IconLoader className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center size-full bg-white md:bg-gray-200">
      <Header />
      <main className="flex flex-col justify-center items-center w-md md:w-160 h-full">
        <OpenViduCard chatroom={chatroom} token={token} />
      </main>
    </div>
  );
}
