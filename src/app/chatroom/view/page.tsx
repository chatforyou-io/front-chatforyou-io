"use client";

import DimmedButton from "@/src/components/buttons/DimmedButton";
import Image from "next/image";

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

export default function Page() {
  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
  }
  
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
