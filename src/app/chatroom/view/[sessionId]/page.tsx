"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import OpenviduStream from '@/src/components/openvidu/OpenviduStream';
import { chatroomToken } from "@/src/libs/chatroom";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";
import DeviceSelectors from "@/src/components/sidebars/DeviceSelectors";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;
  const { publisher, subscribers, joinSession, leaveSession } = useContext(OpenviduContext);
  const { data: userSession } = useSession();
  const userIdx = useMemo(() => userSession?.user.idx, [userSession?.user.idx]);
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [redirect, setRedirect] = useState(false);
  const [leave, setLeave] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChatroom = async () => {
      try {
        const data = await chatroomToken(sessionId, userIdx);
        if (!data.isSuccess) throw new Error(data);
        console.log("data", data);
        setChatroom(data.roomInfo);
        setToken(data.joinUserInfo.camera_token);
      } catch (error) {
        console.error(error);
        alert("채팅방이 존재하지 않습니다.");
        setRedirect(true);
      }
    };

    fetchChatroom();
  }, [sessionId, userIdx]);

  useEffect(() => {
    const fetchOpenvidu = async () => {
      if (!token || !userIdx) return;

      try {
        joinSession(token, userIdx);
      } catch (error) {
        console.error(error);
        alert("채팅방 정보를 가져오는데 실패했습니다.");
        setLeave(true);
      }
    }
    
    fetchOpenvidu();
  }, [token, userIdx, joinSession]);

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
    if (leave) {
      leaveSession();
      setRedirect(true);
    }
  }, [leave, leaveSession]);

  useEffect(() => {
    if (redirect) {
      router.push("/");
    }
  }, [redirect, router]);
  
  return (
    <div className="flex-center size-full">
      <div className="flex-center p-8 w-160 space-y-4 bg-white rounded-2xl">
        <DeviceSelectors />
        <div className="flex w-full space-x-4">
          <div className="flex-center">
            <CustomImage src="/images/icon-user.svg" alt="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
          </div>
          <div className="w-full">
            <h3 className="font-semibold">{chatroom?.roomName}</h3>
            <span className="text-sm">{chatroom?.createDt}</span>
          </div>
          <div>
            <button
              onClick={handleClick}
              className="w-20 h-10 text-sm text-white bg-blue-500 rounded-xl"
            >
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
    </div>
  );
}
