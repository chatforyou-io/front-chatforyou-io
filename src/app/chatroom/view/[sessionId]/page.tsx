"use client";

import { useEffect, useState, useCallback } from "react";
import IconLoader from "@/public/images/icons/loader.svg";
import { chatroomToken } from "@/src/libs/chatroom";
import Header from "@/src/components/items/Header";
import { useSession } from "@/src/contexts/SessionContext";
import { connectChatroomInfoSSE } from "@/src/libs/sses/chatroomInfo";
import { formatDateTime } from "@/src/libs/utils/clientCommon";
import OpenviduCard from "@/src/components/openvidu/OpenviduCard";
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

  const fetchChatroom = useCallback(async () => {
    if (!user?.idx) return;

    try {
      // 채팅방 토큰 발급
      const { isSuccess, roomInfo, joinUserInfo } = await chatroomToken(sessionId, user.idx);

      if (!isSuccess) {
        throw new Error("채팅방 토큰 발급 실패");
      }

      // 채팅방 생성일자 포맷팅
      const createDatetime = formatDateTime(roomInfo.createDate);
      setChatroom({ ...roomInfo, createDatetime });
      setToken(joinUserInfo.camera_token);

      // SSE 연결
      const eventSource = connectChatroomInfoSSE(sessionId, user.idx, {
        onUpdateChatroomInfo: (chatroom) => {
          if (chatroom.createDate) {
            setChatroom({ ...chatroom, createDatetime: formatDateTime(chatroom.createDate) });
          }
        }
      });

      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  }, [sessionId, user?.idx]);

  useEffect(() => {
    fetchChatroom();
  }, [fetchChatroom]);

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
        <OpenviduCard chatroom={chatroom} token={token} />
      </main>
    </div>
  );
}
