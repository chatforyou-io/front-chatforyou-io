"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OpenviduStream from '@/src/components/openvidu/OpenviduStream';
import { chatroomToken } from "@/src/libs/chatroom";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";
import DeviceSelectors from "@/src/components/bars/DeviceSelectors";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconUser from "@/public/images/icon-user.svg";
import { useSession } from "@/src/contexts/SessionContext";
import { connectChatroomInfoSSE } from "@/src/libs/sses/chatroomInfo";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;
  const { publisher, subscribers, joinSession, leaveSession } = useContext(OpenviduContext);
  const { user } = useSession();
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [redirect, setRedirect] = useState(false);
  const [leave, setLeave] = useState(false);
  const router = useRouter();
  const handleRequestFail = useHandleRequestFail();

  useEffect(() => {
    if (!user?.idx) throw new Error("사용자 정보를 가져오는데 실패했습니다.");

    const fetchChatroom = async () => {
      if (!user?.idx) return;

      try {        
        const data = await chatroomToken(sessionId, user.idx);
        if (!data.isSuccess) throw new Error(handleRequestFail(data));
        
        const createDatetime = new Date(data.roomInfo.createDate).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });

        setChatroom({ ...data.roomInfo, createDatetime });
        setToken(data.joinUserInfo.camera_token);
      } catch (error) {
        console.error(error);
        setRedirect(true);
      }
    };

    fetchChatroom();
  }, [sessionId, user?.idx, handleRequestFail]);

  useEffect(() => {
    if (!user?.idx) return;

    const eventSource = connectChatroomInfoSSE(sessionId, user.idx, {
      onUpdateChatroomInfo: (chatroom) => {
        if (chatroom.createDate) {
          const createDatetime = new Date(chatroom.createDate).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          });

          chatroom.createDatetime = createDatetime;
        }

        setChatroom(chatroom);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [sessionId, user?.idx]);

  useEffect(() => {
    if (!token || !user?.idx) return;

    try {
      joinSession(token, user.idx);
    } catch (error) {
      console.error(error);
      setLeave(true);
    }
  }, [token, user?.idx, joinSession]);

  const handleClick = () => {
    setLeave(true);
    setRedirect(true);
  };

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      setLeave(true);
      setRedirect(true);
      event.returnValue = '';
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!leave) return;

    leaveSession();
    setRedirect(true);
  }, [leave, leaveSession]);

  useEffect(() => {
    if (redirect) {
      router.push("/");
    }
  }, [redirect, router]);
  
  return (
    <main className="flex flex-col justify-center items-center size-full bg-gray-200">
      <div className="flex flex-col justify-center items-center p-4 md:p-8 w-sm md:w-160 space-y-4 bg-white rounded-2xl overflow-y-auto">
        <DeviceSelectors />
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
              onClick={handleClick}
              className="w-20 h-10 text-sm text-white bg-blue-500 rounded-xl">
              나가기
            </button>
          </div>
        </div>
        <div className="flex w-full space-x-4">
          <span className="text-sm">인원수: {chatroom?.currentUserCount}명</span>
        </div>
        <div className="flex w-full aspect-video space-x-4 bg-gray-200 rounded-xl">
          {publisher && (
            <OpenviduStream key={publisher.stream.streamId} streamManager={publisher} />
          )}
        </div>
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
