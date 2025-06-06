"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OpenViduDevices from "@/src/components/openvidu/OpenViduDevices";
import OpenViduHeader from "@/src/components/openvidu/OpenViduHeader";
import OpenViduStreamList from "@/src/components/openvidu/OpenViduStreamList";
import { useOpenVidu } from "@/src/contexts/OpenViduContext";
import { useSession } from "@/src/contexts/SessionContext";
import { StreamManager } from "openvidu-browser";

interface OpenViduCardProps {
  chatroom: Chatroom;
  token: string;
}

export default function OpenViduCard({ chatroom, token }: OpenViduCardProps) {
  const { publisher, subscribers, initSession, joinSession, leaveSession } = useOpenVidu();
  const { user } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (!token || !user) return;

    const setup = async () => {
      try {
        await initSession();
        await joinSession(token, user.idx);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    setup();

    return () => {
      leaveSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const streamManagers: StreamManager[] = publisher ? [publisher, ...subscribers] : subscribers;

  if (streamManagers.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 p-4 md:p-8 bg-white rounded-2xl md:shadow-xl">
        <OpenViduDevices />
        <OpenViduHeader chatroom={chatroom} />
        <p className="text-gray-500">현재 참여자가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 md:p-8 bg-white rounded-2xl md:shadow-xl">
      <OpenViduDevices />
      <OpenViduHeader chatroom={chatroom} />
      <OpenViduStreamList streamManagers={publisher ? [publisher, ...subscribers] : subscribers} />
    </div>
  );
}