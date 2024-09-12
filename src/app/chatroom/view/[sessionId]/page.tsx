"use client";

import DimmedButton from "@/src/components/buttons/DimmedButton";
import { chatroomInfo } from "@/src/libs/chatroom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Video from '@/src/components/openvidu/VideoCall';
import { useRouter } from "next/navigation";
import { requestToken } from "@/src/libs/openvidu";
import { OpenVidu, Publisher, Session, StreamManager } from "openvidu-browser";

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { sessionId } = params;
  const { data: userSession, status } = useSession();
  const [chatroom, setChatroom] = useState<Chatroom | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
  const router = useRouter();

  // 채팅방 정보 가져오기
  useEffect(() => {
    const getChatroomInfo = async () => {
      const data = await chatroomInfo(sessionId);
      
      if (!data.isSuccess) {
        router.push('/');
        return;
      }

      setChatroom(data.roomData);
    }
    getChatroomInfo();
  }, [router, sessionId]);

  // 토큰 가져오기
  useEffect(() => {
    console.log(sessionId);
    console.log(userSession?.user.idx);

    if (!userSession?.user.idx) {
      router.push('/');
      return;
    }

    const getToken = async () => {
      const token = await requestToken(sessionId, userSession?.user.idx);
      setToken(token);
    }
    getToken();
  }, [router, sessionId, userSession?.user.idx]);

  useEffect(() => {
    if (!token || !userSession?.user.name) {
      return;
    }

    const joinSession = async () => {
      const ov = new OpenVidu();
      const session = ov.initSession();

      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      session.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager));
      });

      await session.connect(token, { clientData: userSession?.user.name });

      const publisher = ov.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      });

      await session.publish(publisher);

      var devices = await ov.getDevices();
      var videoDevices = devices.filter(device => device.kind === 'videoinput');
      var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

      setSession(session);
      setPublisher(publisher);
    }
    joinSession();
  }, [token, userSession?.user.name]);
  
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
        <div className="flex w-full space-x-4 bg-gray-200 rounded-xl">
          {session && publisher && (
            <Video key={publisher.stream.streamId} streamManager={publisher} />
          )}
          {subscribers.map(subscriber => (
            <Video key={subscriber.id} streamManager={subscriber} />
          ))}
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
          <DimmedButton type="button" label="채팅" />
          <DimmedButton type="button" label="채팅" />
          <DimmedButton type="button" label="채팅" />
          <DimmedButton type="button" label="채팅" />
          <DimmedButton type="button" label="채팅" />
          <DimmedButton type="button" label="채팅" />
          <DimmedButton type="button" label="채팅" />
        </div>
      </div>
    </div>
  );
}
