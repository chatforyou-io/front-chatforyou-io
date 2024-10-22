"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import VideoCall from '@/src/components/openvidu/VideoCall';
import { chatroomInfo } from "@/src/libs/chatroom";
import { useOpenvidu } from "@/src/webhooks/useOpenvidu";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  const { sessionId } = params;
  const { data: userSession, status } = useSession();
  const { session, publisher, subscribers, joinSession, leaveSession } = useOpenvidu({ sessionId, userIdx: userSession?.user.idx });
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && userSession?.user?.idx) {
      joinSession();
    };
  }, [status, userSession?.user?.idx, joinSession]);

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
  }, [sessionId]);

  const handleClick = () => {
    leaveSession();
    router.push('/');
  }
  
  return (
    <div className="flex-center w-full h-full">
      <div className="flex-center p-8 w-160 space-y-4 bg-white rounded-2xl">
        <div className="flex w-full space-x-4">
          <div className="flex-center">
            <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
          </div>
          <div className="w-full">
            <h3 className="font-semibold">{chatroom?.roomName}</h3>
            <span className="text-sm">1990.01.01</span>
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
        <div className="flex w-full space-x-4 bg-gray-200 rounded-xl">
          {session && [publisher, ...subscribers].map((streamManager) => (
            <VideoCall key={streamManager?.stream.streamId} streamManager={streamManager} />
          ))}
        </div>
        <div className="flex w-full space-x-4">
          {subscribers.map(subscriber => (
            <div key={subscriber.id} className="w-full h-20 bg-gray-200 rounded-xl">
              <VideoCall streamManager={subscriber} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
