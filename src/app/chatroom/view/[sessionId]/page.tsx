"use client";

import DimmedButton from "@/src/components/buttons/DimmedButton";
import { chatroomInfo } from "@/src/lib/chatroom";
import Image from "next/image";
import { useEffect } from "react";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;

  useEffect(() => {
    const getChatroomInfo = async () => {
      try {
        const data = await chatroomInfo(sessionId);
        if (!data.isSuccess) {
          throw new Error();
        }
  
        const roomData = data.roomData;
        console.log('roomData:', roomData);
      } catch (error) {
        console.error('채팅방 정보 조회 중 오류 발생:', error);
        alert('채팅방 정보 조회 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
      }
    }
    getChatroomInfo();
  }, [sessionId]);
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center p-4 w-full max-w-xl space-y-4 bg-white rounded-3xl">
        <div className="flex w-full space-x-4">
          <div className="flex justiffy-center items-center">
            <Image src="/images/icon-user.svg" alt="room" width={48} height={48} className="border-2 border-black rounded-full" />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-semibold text-xl text-gray-800">Meeting</h3>
            <p className="text-sm text-gray-500">2024.08.27</p>
          </div>
        </div>
        <div className="flex w-full space-x-4">
          <div className="flex justiffy-center items-center">
            <p className="text-sm text-gray-500">인원수</p>
          </div>
          <div className="flex justiffy-center items-center">
            <p className="text-sm text-gray-500">4명</p>
          </div>
        </div>
        <div className="flex w-full space-x-4">
          <div className="w-full h-20 bg-gray-200 rounded-xl">

          </div>
        </div>
        <div className="flex w-full space-x-4">
          <div className="w-full h-20 bg-gray-200 rounded-xl">

          </div>
          <div className="w-full h-20 bg-gray-200 rounded-xl">

          </div>
          <div className="w-full h-20 bg-gray-200 rounded-xl">

          </div>
        </div>
        <div className="flex w-full space-x-4">
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
          <DimmedButton type="button" onClick={() => {}} label="채팅" />
        </div>
      </div>
    </div>
  );
}