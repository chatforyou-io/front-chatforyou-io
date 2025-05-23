import { OpenVidu, Publisher, Session, Subscriber } from "openVidu-browser";
import { createContext, useState, ReactNode, useRef, useCallback, useContext, useEffect } from "react";

const OpenViduContext = createContext<OpenViduContextType | undefined>(undefined);

export default function OpenViduProvider({ children }: { children: ReactNode }) {
  const ov = useRef<OpenVidu | null>(null);
  const session = useRef<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(undefined);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const initSession = async () => {
    if (ov.current) return;

    ov.current = new OpenVidu();
    session.current = ov.current.initSession();

    // 프로덕션 모드
    ov.current.enableProdMode();

    // 세션 이벤트 리스너 등록
    session.current.on("streamCreated", (event) => {
      const subscriber = session.current!.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });
    session.current.on("streamDestroyed", (event) => {
      const streamManager = event.stream.streamManager;
      setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== streamManager));
    });
  };

  const joinSession = async (token: string, userIdx: number) => {
    if (!ov.current) {
      console.error("OpenVidu 인스턴스가 초기화되지 않았습니다.");
      return;
    }

    if (!session.current) {
      console.error("세션이 초기화되지 않았습니다.");
      return;
    }

    await session.current.connect(token, { clientData: userIdx });

    const newPublisher = ov.current.initPublisher(undefined, {
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
  };

  const leaveSession = useCallback(() => {
    if (session.current) {
      if (publisher) {
        const stream = publisher.stream.getMediaStream();
        stream.getTracks().forEach((track) => track.stop());
      }
      
      session.current.disconnect();
      session.current = null;
    }

    setPublisher(null);
    setSubscribers([]);

    ov.current = null;
  }, [publisher]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
      setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
    });
  }, []);

  const changeAudioDevice = (deviceId: string) => setSelectedAudio(deviceId);
  const changeVideoDevice = (deviceId: string) => setSelectedVideo(deviceId);

  const toggleAudio = () => {
    if (publisher) {
      publisher.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (publisher) {
      publisher.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  return (
    <OpenViduContext.Provider value={{ ov: ov.current,
      session: session.current,
      publisher,
      subscribers,
      audioDevices,
      videoDevices,
      selectedAudio,
      selectedVideo,
      isAudioEnabled,
      isVideoEnabled,
      changeAudioDevice,
      changeVideoDevice,
      toggleAudio,
      toggleVideo,
      initSession,
      joinSession,
      leaveSession,  
    }}>
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