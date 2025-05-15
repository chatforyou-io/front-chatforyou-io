"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import OpenviduDevices from "@/src/components/openvidu/OpenviduDevices";
import OpenviduHeader from "@/src/components/openvidu/OpenviduHeader";
import OpenviduStreamList from "@/src/components/openvidu/OpenviduStreamList";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";
import { useSession } from "@/src/contexts/SessionContext";

interface OpenviduCardProps {
  chatroom: Chatroom;
  token: string;
}

export default function OpenviduCard({ chatroom, token }: OpenviduCardProps) {
  const { publisher, subscribers, joinSession } = useContext(OpenviduContext);
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
  }, [token, user?.idx, joinSession]);
  
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-4 md:p-8 bg-white rounded-2xl md:shadow-xl">
      <OpenviduDevices />
      <OpenviduHeader chatroom={chatroom} />
      <OpenviduStreamList streamManagers={publisher ? [publisher, ...subscribers] : subscribers} />
    </div>
  );
}