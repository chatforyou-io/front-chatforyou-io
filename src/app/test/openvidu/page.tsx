'use client';

import { Device, OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import { FormEvent, useEffect, useRef, useState } from "react";
import UserVideo from '@/src/components/openvidu/UserVideo';
import { getToken } from '@/src/lib/openvidu';

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

export default function Page() {
  const mySessionIdRef = useRef<HTMLInputElement>(null);
  const myUserNameRef = useRef<HTMLInputElement>(null);
  const maxUserCountRef = useRef<HTMLInputElement>(null);
  const [ov, setOv] = useState<OpenVidu | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [currentVideoDevice, setCurrentVideoDevice] = useState<Device | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<StreamManager | undefined>(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // --- 1) Get an OpenVidu object ---
    const newOv = new OpenVidu();
    setOv(newOv);

    // --- 2) Init a session ---
    const newSession = newOv.initSession();
    setSession(newSession);
  };
    
  useEffect(() => {
    if (!ov || !session) return;

    // --- 3) Specify the actions when events take place in the session ---
    // On every new Stream received...
    session.on('streamCreated', (event: any) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      const subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);
      setSubscribers(subscribers);
    });

    // On every Stream destroyed...
    session.on('streamDestroyed', (event: any) => {
      // Remove the stream from 'subscribers' array
      const streamManager = event.stream.streamManager;

      const index = subscribers.indexOf(streamManager as Subscriber, 0);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
      setSubscribers(subscribers);
    });

    // On every asynchronous exception...
    session.on('exception', (exception: any) => {
      console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---
    // Get a token from the OpenVidu deployment
    const mySessionId = mySessionIdRef.current!.value;
    const myUserName = mySessionIdRef.current!.value;
    const maxUserCount = parseInt(maxUserCountRef.current!.value);

    getToken(mySessionId).then((token) => {      
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      session
        .connect(token, { clientData: myUserName })
        .then(async () => {
          // --- 5) Get your own camera stream ---
          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisher = await ov.initPublisherAsync(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---
          session.publish(publisher);

          // Obtain the current video device in use
          const devices = await ov.getDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

          // Set the main video in the page to display our webcam and store our Publisher
          setCurrentVideoDevice(currentVideoDevice);
          setMainStreamManager(publisher);
          setPublisher(publisher);
        })
        .catch((error: any) => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });
  }, [ov, session, subscribers]);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">방 만들기</h1>
      </div>
      <div className="mt-12 mx-auto px-8"> 
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <input
            type="text"
            ref={mySessionIdRef}
            className="border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
            placeholder="제목"
            defaultValue="SessionA"
            required
          />
          <input
            type="text"
            ref={myUserNameRef}
            className="border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
            placeholder="참가자 이름"
            defaultValue={"Participant" + Math.floor(Math.random() * 100)}
            required
          />
          <input
            type="text"
            ref={maxUserCountRef}
            className="border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
            placeholder="최대 참가자 수"
            defaultValue="2"
            required
          />
          <button
            type="submit"
            className="w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full"
          >방 만들기</button>
        </form>
        {session && (
          <UserVideo
            publisher={publisher as Publisher}
            subscribers={subscribers as Subscriber[]}
          />
        )}
      </div>
    </>
  );
}