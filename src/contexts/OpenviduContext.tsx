import { Device, OpenVidu, Publisher, Session, Subscriber } from "openVidu-browser";
import { createContext, useState, ReactNode, useRef, useCallback, useContext } from "react";

const OpenViduContext = createContext<OpenViduContextType | undefined>(undefined);

export default function OpenViduProvider({ children }: { children: ReactNode }) {
  const ov = useRef<OpenVidu>();
  const session = useRef<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);

  const initOpenVidu = async () => {
    if (ov.current) return;

    ov.current = new OpenVidu();
    ov.current.enableProdMode();
  };

  const joinSession = useCallback(async (token: string, userIdx: number) => {
    await initOpenVidu();

    if (session.current?.connection?.connectionId) {
      console.error("이미 세션에 참여 중입니다.");
      return;
    }
  
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

    const newPublisher = ov.current!.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
      mirror: false,
    });

    await session.current.publish(newPublisher);

    setPublisher(newPublisher);
  }, []);

  const leaveSession = useCallback(() => {
    if (session.current) {
      if (publisher) {
        const stream = publisher.stream.getMediaStream();
        stream.getTracks().forEach((track) => track.stop());
      }
      
      session.current.disconnect();
      session.current = undefined;
    }

    setPublisher(undefined);
    setSubscribers([]);

    ov.current = undefined;
  }, [publisher]);

  const getDevices = useCallback(async () => {
    await initOpenVidu();

    const devices = await ov.current!.getDevices();
    const audioDevices = devices.filter((device) => device.kind === "audioinput");
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    
    setAudioInputs(audioDevices);
    setVideoInputs(videoDevices);
  }, []);

  const setDevice = useCallback(async (device: Device) => {
    await initOpenVidu();

    if (!ov.current) return;
    if (!session.current) return;

    const newPublisher = await ov.current.initPublisherAsync(undefined, {
      audioSource: device.kind === "audioinput" ? device.deviceId : undefined,
      videoSource: device.kind === "videoinput" ? device.deviceId : undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
      mirror: false,
    });

    if (publisher) await session.current.unpublish(publisher);

    await session.current.publish(newPublisher);

    setPublisher(newPublisher);
  }, [publisher]);

  return (
    <OpenViduContext.Provider value={{ ov: ov.current, session: session.current, publisher, subscribers, audioInputs, videoInputs, joinSession, leaveSession, getDevices, setDevice }}>
      {children}
    </OpenViduContext.Provider>
  );
};

export const useOpenVidu = (): OpenViduContextType => {
  const context = useContext(OpenViduContext);
  if (context === undefined) {
    throw new Error("useOpenVidu는 OpenViduProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}