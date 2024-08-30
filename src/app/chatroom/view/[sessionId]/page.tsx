"use client";

import DimmedButton from "@/src/components/buttons/DimmedButton";
import { chatroomInfo } from "@/src/libs/chatroom";
import Image from "next/image";
import { OpenVidu, Publisher, Session, StreamManager } from "openvidu-browser";
import { use, useEffect, useState } from "react";
import { createToken } from "@/src/libs/openvidu";
import UserVideo from "@/src/components/openvidu/UserVideo";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const [ov, setOv] = useState<OpenVidu | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [stream, setStream] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);

  useEffect(() => {
    const getChatroomInfo = async () => {
      try {
        const data = await chatroomInfo(sessionId);
        if (!data.isSuccess) {
          throw new Error();
        }
  
        setChatroom(data.roomData);
      } catch (error) {
        console.error('채팅방 정보 조회 중 오류 발생:', error);
        alert('채팅방 정보 조회 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
      }
    }
    getChatroomInfo();
  }, [sessionId]);

  useEffect(() => {
    async function joinSession() {
      const ov = new OpenVidu();
      const session = ov.initSession();

      session.on("streamCreated", (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers(subscribers => [...subscribers, subscriber]);
      });
  
      session.on("streamDestroyed", (event) => {
        setSubscribers(subscribers => subscribers.filter((subscriber) => subscriber.stream !== event.stream));
      });
  
      session.on('exception', (exception: any) => {
        console.warn(exception);
      });

      setOv(ov);
      setSession(session);
    };
    joinSession();
  }, [chatroom]);

  useEffect(() => {
    const joinSession = async () => {
      if (!ov || !session) return;

      try {
        session.connect(await createToken(sessionId), { clientData: sessionId });

        const stream = await ov.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
        });
        setStream(stream);

        session.publish(stream);
      } catch (error) {
        console.error('세션 연결 중 오류 발생:', error);
        alert('세션 연결 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
      }
    };
    joinSession();
  }, [ov, session]);
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center p-4 w-full max-w-xl space-y-4 bg-white rounded-3xl">
        <div className="flex w-full space-x-4">
          <div className="flex justiffy-center items-center">
            <Image src="/images/icon-user.svg" alt="room" width={48} height={48} className="border-2 border-black rounded-full" />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <h3 className="font-semibold text-xl text-gray-800">{chatroom?.roomName}</h3>
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
            {session && stream && (
              <UserVideo
                publisher={stream}
                subscribers={subscribers}
              />
            )}
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
