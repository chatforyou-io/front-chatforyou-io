"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import OpenviduStream from '@/src/components/openvidu/OpenviduStream';
import { chatroomToken } from "@/src/libs/chatroom";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";
import DeviceSelectors from "@/src/components/bars/DeviceSelectors";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconUser from "@/public/images/icon-user.svg";
import { useSession } from "@/src/contexts/SessionContext";
import { connectChatroomInfoSSE } from "@/src/libs/sses/chatroomInfo";
import { formatDateTime } from "@/src/libs/utils/clientCommon";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params: { sessionId } }: PageProps) {
  const router = useRouter();
  const { user } = useSession();
  const { publisher, subscribers, joinSession, leaveSession } = useContext(OpenviduContext);

  const [chatroom, setChatroom] = useState<Chatroom>();
  const [token, setToken] = useState<string>();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const handleRequestFail = useHandleRequestFail();

  /**
   * 채팅방 정보 가져오기
   */
  const fetchChatroom = useCallback(async () => {
    if (!user?.idx) return;

    try {
      // 채팅방 토큰 발급
      const data = await chatroomToken(sessionId, user.idx);

      if (!data.isSuccess) {
        throw new Error(handleRequestFail(data));
      }

      // 채팅방 생성일자 포맷팅
      const createDatetime = formatDateTime(data.roomInfo.createDate);
      setChatroom({ ...data.roomInfo, createDatetime });
      setToken(data.joinUserInfo.camera_token);

      // SSE 연결
      const eventSource = connectChatroomInfoSSE(sessionId, user.idx, {
        onUpdateChatroomInfo: (chatroom) => {
          if (chatroom.createDate) {
            const createDatetime = formatDateTime(chatroom.createDate);
            setChatroom({ ...chatroom, createDatetime });
          }
        }
      });

      return () => eventSource.close();
    } catch (error) {
      console.error(error);
      setShouldRedirect(true);
    }
  }, [user?.idx, sessionId, handleRequestFail]);

  useEffect(() => {
    fetchChatroom();
  }, [fetchChatroom]);

  useEffect(() => {
    if (token && user?.idx) {
      try {
        joinSession(token, user.idx);
      } catch (error) {
        console.error(error);
        setShouldRedirect(true);
      }
    }
  }, [token, user?.idx, joinSession]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      leaveSession();
      setShouldRedirect(true);
      event.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [leaveSession]);

  useEffect(() => {
    if (shouldRedirect) {
      leaveSession();
      router.push("/");
    }
  }, [shouldRedirect, router, leaveSession]);

  const handleLeaveClick = () => setShouldRedirect(true);
  
  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      <div className="flex flex-col justify-center items-center p-4 md:p-8 w-sm md:w-160 space-y-4 bg-white rounded-2xl overflow-y-auto">
        {/* 디바이스 선택 UI */}
        <DeviceSelectors />

        {/* 채팅방 정보 */}
        <div className="flex w-full space-x-4">
          <div className="flex justify-center items-center">
            <IconUser aria-label="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
          </div>
          <div className="w-full">
            <h3 className="font-semibold">{chatroom?.roomName}</h3>
            <span className="text-sm">{chatroom?.createDatetime}</span>
          </div>
          <div>
            <button
              type="button"
              onClick={handleLeaveClick}
              className="w-20 h-10 text-sm text-white bg-blue-500 rounded-xl">
              나가기
            </button>
          </div>
        </div>

        {/* 채팅방 인원수 */}
        <div className="flex w-full space-x-4">
          <span className="text-sm">인원수: {chatroom?.currentUserCount}명</span>
        </div>

        {/* 채팅방 퍼블리셔 스트림 */}
        <div className="flex w-full aspect-video space-x-4 bg-gray-200 rounded-xl">
          {publisher && (
            <OpenviduStream key={publisher.stream.streamId} streamManager={publisher} />
          )}
        </div>

        {/* 채팅방 구독자 스트림 */}
        <div className="grid grid-cols-3 w-full space-x-4">
          {subscribers && subscribers.map(subscriber => (
            <div key={subscriber.stream.streamId} className="w-full aspect-video bg-gray-200 rounded-xl">
              <OpenviduStream streamManager={subscriber} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
