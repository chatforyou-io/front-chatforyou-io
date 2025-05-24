import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { createContext, useState, ReactNode, useRef, useContext, useEffect, useCallback, useMemo } from "react";

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

  /**
   * OpenVidu 세션 초기화
   * @returns {Promise<void>}
   */
  const initSession = useCallback(async (): Promise<void> => {
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
  }, []);

  /**
   * OpenVidu 세션 참여
   * @param {string}
   * @param {number} userIdx
   * @returns {Promise<void>}
   */
  const joinSession = useCallback(async (token: string, userIdx: number): Promise<void> => {
    if (!ov.current) {
      console.error("OpenVidu 인스턴스가 초기화되지 않았습니다.");
      return;
    }

    if (!session.current) {
      console.error("세션이 초기화되지 않았습니다.");
      return;
    }

    await session.current.connect(token, { clientData: userIdx });

    const newPublisher = await ov.current.initPublisherAsync(undefined, {
      audioSource: selectedAudio ?? undefined,
      videoSource: selectedVideo ?? undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
      mirror: false,
    });

    await session.current.publish(newPublisher);

    setPublisher(newPublisher);
  }, [selectedAudio, selectedVideo]);

  /**
   * OpenVidu 세션 종료
   * @returns {Promise<void>}
   */
  const leaveSession = useCallback(async (): Promise<void> => {
    if (session.current) {
      session.current.disconnect();
    }

    ov.current = null;
    session.current = null;
    setPublisher(null);
    setSubscribers([]);
  }, []);

  // 장치 목록 가져오기
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
      setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
    });
  }, []);

  // 장치 변경 시 선택된 장치 업데이트
  const changeAudioDevice = useCallback((deviceId: string) => setSelectedAudio(deviceId), []);
  const changeVideoDevice = useCallback((deviceId: string) => setSelectedVideo(deviceId), []);

  // 오디오 장치 변경
  const toggleAudio = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  }, [publisher, isAudioEnabled]);

  // 비디오 장치 변경
  const toggleVideo = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  }, [publisher, isVideoEnabled]);

  const contextValue = useMemo(() => ({
    ov: ov.current,
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
  }), [
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
  ]);

  return (
    <OpenViduContext.Provider value={contextValue}>
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