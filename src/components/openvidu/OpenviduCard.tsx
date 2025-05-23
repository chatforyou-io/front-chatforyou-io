"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OpenViduDevices from "@/src/components/openVidu/OpenViduDevices";
import OpenViduHeader from "@/src/components/openVidu/OpenViduHeader";
import OpenViduStreamList from "@/src/components/openVidu/OpenViduStreamList";
import { useOpenVidu } from "@/src/contexts/OpenViduContext";
import { useSession } from "@/src/contexts/SessionContext";

interface OpenViduCardProps {
  chatroom: Chatroom;
  token: string;
}

export default function OpenViduCard({ chatroom, token }: OpenViduCardProps) {
  const { publisher, subscribers, joinSession } = useOpenVidu();
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user?.idx) return;

    try {
      joinSession(token, user.idx);
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  }, [token, user?.idx, joinSession, router]);
  
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 md:p-8 bg-white rounded-2xl md:shadow-xl">
      <OpenViduDevices />
      <OpenViduHeader chatroom={chatroom} />
      <OpenViduStreamList streamManagers={publisher ? [publisher, ...subscribers] : subscribers} />
    </div>
  );
}