import { Device, OpenVidu, Publisher, PublisherProperties, Session, Subscriber } from "openvidu-browser";
import { createContext, useState, ReactNode, useRef, useCallback } from "react";

interface OpenviduContextType {
  ov: OpenVidu | undefined;
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[] | undefined;
  audioInputs: Device[] | undefined;
  videoInputs: Device[] | undefined;
  publisherProperties: PublisherProperties | undefined;
  joinSession: (token: string, userIdx: number) => void;
  leaveSession: () => void;
  getDevices: () => void;
  setDevice: (device: Device) => void;
}

export const OpenviduContext = createContext<OpenviduContextType>({
  ov: undefined,
  session: undefined,
  publisher: undefined,
  subscribers: [],
  audioInputs: [],
  videoInputs: [],
  publisherProperties: undefined,
  joinSession: () => {},
  leaveSession: () => {},
  getDevices: () => {},
  setDevice: () => {},
});

export default function OpenviduProvider({ children }: { children: ReactNode }) {
  const ov = useRef<OpenVidu>();
  const session = useRef<Session>();
  const publisherProperties = useRef<PublisherProperties>({
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
    resolution: "640x480",
    frameRate: 30,
    insertMode: "APPEND",
  });
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);

  const initOpenvidu = async () => {
    if (!ov.current) {
      ov.current = new OpenVidu();
      ov.current.enableProdMode();
    }

    await ov.current.getUserMedia(publisherProperties.current);
  }

  const joinSession = useCallback(async (token: string, userIdx: number) => {
    await initOpenvidu();

    if (session.current?.connection?.connectionId) {
      console.error("이미 세션에 참여 중입니다.");
      return;
    }

    const devices = await ov.current!.getDevices();
    const audioDevices = devices.filter((device) => device.kind === "audioinput");
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    if (!audioDevices.length || !videoDevices.length) {
      console.error("디바이스가 없습니다.");
      return;
    }

    audioDevices.length ? publisherProperties.current.audioSource = audioDevices[0].deviceId : undefined;
    videoDevices.length ? publisherProperties.current.videoSource = videoDevices[0].deviceId : undefined;
  
    session.current = ov.current!.initSession();

    session.current.on("streamCreated", (event) => {
      const streamManager = event.stream.streamManager;

      if (streamManager?.stream.connection.connectionId === session.current?.connection.connectionId) return;
    
      const subscriber = session.current!.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.current.on("streamDestroyed", (event) => {
      const streamManager = event.stream.streamManager;
      setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== streamManager));
    });

    await session.current.connect(token, { clientData: userIdx });

    const newPublisher = ov.current!.initPublisher(undefined, publisherProperties.current);

    await session.current.publish(newPublisher);

    setPublisher(newPublisher);
  }, []);

  const leaveSession = useCallback(() => {
    if (session.current) {
      session.current.disconnect();
      session.current = undefined;
    }

    setPublisher(undefined);
    setSubscribers([]);

    ov.current = undefined;
  }, []);

  const getDevices = useCallback(async () => {
    await initOpenvidu();

    const devices = await ov.current!.getDevices();
    const audioDevices = devices.filter((device) => device.kind === "audioinput");
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    
    setAudioInputs(audioDevices);
    setVideoInputs(videoDevices);
  }, []);

  const setDevice = useCallback(async (device: Device) => {
    await initOpenvidu();

    if (!ov.current) return;
    if (!session.current) return;

    if (device.kind === "audioinput") publisherProperties.current.audioSource = device.deviceId;
    if (device.kind === "videoinput") publisherProperties.current.videoSource = device.deviceId;

    const newPublisher = await ov.current.initPublisherAsync(undefined, publisherProperties.current);

    if (publisher) await session.current.unpublish(publisher);

    await session.current.publish(newPublisher);

    setPublisher(newPublisher);
  }, [publisher]);

  return (
    <OpenviduContext.Provider value={{ ov: ov.current, session: session.current, publisherProperties: publisherProperties.current, publisher, subscribers, audioInputs, videoInputs, joinSession, leaveSession, getDevices, setDevice }}>
      {children}
    </OpenviduContext.Provider>
  );
};