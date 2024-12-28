"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import OpenviduStream from '@/src/components/openvidu/OpenviduStream';
import { chatroomInfo } from "@/src/libs/chatroom";
import { useOpenvidu } from "@/src/webhooks/useOpenvidu";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;
  const { data: userSession } = useSession();
  const { session, publisher, subscribers, joinSession, leaveSession } = useOpenvidu({ sessionId, userIdx: userSession?.user.idx });
  const hasJoinedRef = useRef(false);
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (userSession?.user?.idx && !hasJoinedRef.current) {
      joinSession();
      hasJoinedRef.current = true;
    }
  }, [userSession?.user?.idx, joinSession]);

  useEffect(() => {
    const getChatroomInfo = async () => {
      try {
        const data = await chatroomInfo(sessionId);
        if (!data.isSuccess) {
          throw new Error();
        }
        setChatroom(data.roomData);
      } catch (error) {
        alert('채팅방이 존재하지 않습니다.');
        router.push('/');
      }
    }
    getChatroomInfo();
  }, [sessionId, router]);

  const handleClick = () => {
    leaveSession();
    router.push('/');
  }
  
  return (
    <div className="flex-center w-full h-full">
      <div className="flex-center p-8 w-160 space-y-4 bg-white rounded-2xl">
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
          {session && [publisher].filter((currPublisher, index) => index === 0).map((streamManager) => (
            <OpenviduStream key={streamManager?.stream.streamId} streamManager={streamManager} />
          ))}
        </div>
        <div className="grid grid-cols-3 w-full space-x-4">
          {session && [subscribers].map(subscriber => subscriber.map((streamManager) => (
            <div key={streamManager?.stream.streamId} className="w-full aspect-video bg-gray-200 rounded-xl">
              <OpenviduStream streamManager={streamManager} />
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
