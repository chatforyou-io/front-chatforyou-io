'use client';

import Header from '@/components/Header';
import { getToken } from '@/app/lib/openvidu';
import { Device, OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { set } from 'firebase/database';
import UserVideo from '@/components/openvidu/UserVideo';

export default function ChatRoom() {
  const mySessionIdRef = useRef<HTMLInputElement>(null);
  const myUserNameRef = useRef<HTMLInputElement>(null);
  const [ov, setOv] = useState<OpenVidu | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [currentVideoDevice, setCurrentVideoDevice] = useState<Device | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<StreamManager | undefined>(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const joinSession = async (event: FormEvent) => {
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
    const myUserName = myUserNameRef.current!.value;

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
  }, [ov, session]);

  return (
    <main className="flex flex-col items-center justify-center h-full bg-gray-200 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      <div className="border-x border-gray-400 mt-12 p-4 w-full max-w-xl h-full bg-white dark:bg-gray-700">
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-xl font-bold">Join a video session</h1>
          <form className="flex flex-col gap-2 w-full max-w-xs" onSubmit={joinSession}>
            <div className="flex justify-between items-center gap-4 w-full">
              <label className="font-bold">Username</label>
              <input
                type="text"
                ref={myUserNameRef}
                className='border border-black px-2 py-1 w-full rounded'
                required
              />
            </div>
            <div className="flex justify-between items-center gap-4 w-full">
              <label className="font-bold">Sessionid</label>
              <input
                type="text"
                ref={mySessionIdRef}
                className='border border-black px-2 py-1 w-full rounded'
                required
              />
            </div>
            <button className="border border-black px-2 py-1 w-full hover:bg-gray-300 rounded" type="submit">JOIN</button>
          </form>
          {session && (
            <UserVideo
              publisher={publisher as Publisher}
              subscribers={subscribers as Subscriber[]}
            />
          )}
        </div>
      </div>
    </main>
  );
}