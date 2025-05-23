"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OpenViduDevices from "@/src/components/openvidu/OpenViduDevices";
import OpenViduHeader from "@/src/components/openvidu/OpenViduHeader";
import OpenViduStreamList from "@/src/components/openvidu/OpenViduStreamList";
import { useOpenVidu } from "@/src/contexts/OpenViduContext";
import { useSession } from "@/src/contexts/SessionContext";

interface OpenViduCardProps {
  chatroom: Chatroom;
  token: string;
}

export default function OpenViduCard({ chatroom, token }: OpenViduCardProps) {
  const { publisher, subscribers, initSession, joinSession } = useOpenVidu();
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) return;

    try {
      initSession();
      joinSession(token, user.idx);
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  }, [token, user, initSession, joinSession, router]);
  
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 md:p-8 bg-white rounded-2xl md:shadow-xl">
      <OpenViduDevices />
      <OpenViduHeader chatroom={chatroom} />
      <OpenViduStreamList streamManagers={publisher ? [publisher, ...subscribers] : subscribers} />
    </div>
  );
}