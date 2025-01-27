"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import OpenviduStream from '@/src/components/openvidu/OpenviduStream';
import { chatroomInfo, chatroomToken } from "@/src/libs/chatroom";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";
import DeviceSelectors from "@/src/components/sidebars/DeviceSelectors";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;
  const { publisher, subscribers, currentAudioInput, currentVideoInput, joinSession, leaveSession } = useContext(OpenviduContext);
  const { data: userSession } = useSession();
  const userIdx = useMemo(() => userSession?.user.idx, [userSession?.user.idx]);
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchOpenvidu = async () => {
      if (!sessionId || !userIdx || !currentAudioInput || !currentVideoInput) return;
      
      try {
        const data = await chatroomToken(sessionId, userIdx);
        if (!data.isSuccess) throw new Error("토큰을 가져오는데 실패했습니다.");

        const { roomInfo, joinUserInfo } = data;

        setChatroom(roomInfo);
        joinSession(joinUserInfo.camera_token, userIdx);
      } catch (error) {
        console.error("OpenVidu 세션 참여 중 오류 발생:", error);
        alert("채팅방 정보를 가져오는데 실패했습니다.");
        router.push("/");
      }
    }

    fetchOpenvidu();
  }, [sessionId, userIdx, currentAudioInput, currentVideoInput, joinSession, router]);

  const handleClick = () => {
    leaveSession();
    router.push('/');
  };

  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, [leaveSession]);
  
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
