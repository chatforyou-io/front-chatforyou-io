import { Device, OpenVidu, Publisher, PublisherProperties, Session, StreamEvent, Subscriber } from "openvidu-browser";
import { createContext, useState, ReactNode, useRef, useCallback } from "react";

/**
 * Openvidu 컨텍스트 타입
 */
interface OpenviduContextType {
  ov?: OpenVidu;
  session?: Session;
  publisher?: Publisher;
  subscribers?: Subscriber[];
  audioInputs?: Device[];
  videoInputs?: Device[];
  publisherProperties?: PublisherProperties;
  joinSession: (token: string, userIdx: number) => void;
  leaveSession: () => void;
  getDevices: () => void;
  setDevice: (device: Device) => void;
}

/**
 * Openvidu 컨텍스트 기본 값
 */
const defaultOpenviduContext: OpenviduContextType = {
  ov: undefined,
  session: undefined,
  publisher: undefined,
  subscribers: [],
  audioInputs: [],
  videoInputs: [],
  publisherProperties: {
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
    resolution: "640x480",
    frameRate: 30,
    insertMode: "APPEND",
  },
  joinSession: () => {},
  leaveSession: () => {},
  getDevices: () => {},
  setDevice: () => {},
};

/**
 * Openvidu 컨텍스트
 */
export const OpenviduContext = createContext<OpenviduContextType>(defaultOpenviduContext);

/**
 * Openvidu 프로바이더
 */
export default function OpenviduProvider({ children }: { children: ReactNode }) {
  const ov = useRef<OpenVidu>();
  const session = useRef<Session>();
  const publisherProperties = useRef<PublisherProperties>({ ...defaultOpenviduContext.publisherProperties });
    
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);

  /**
   * Openvidu 초기화
   */
  const initOpenvidu = useCallback(async () => {
    if (ov.current) return;

    ov.current = new OpenVidu();
    ov.current.enableProdMode();
    await ov.current.getUserMedia(publisherProperties.current);
  }, []);

  /**
   * 장치 조회
   */
  const fetchDevices = useCallback(async () => {
    await initOpenvidu();

    const devices = await ov.current!.getDevices();
    const audioDevices = devices.filter((device) => device.kind === "audioinput");
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    setAudioInputs(audioDevices);
    setVideoInputs(videoDevices);
  }, [initOpenvidu]);

  /**
   * 스트림 이벤트 처리
   */
  const handleStreamEvents = useCallback(() => {
    session.current?.on("streamCreated", (event: StreamEvent) => {
      const streamManager = event.stream.streamManager;
      if (streamManager?.stream.connection.connectionId === session.current?.connection.connectionId) return;

      const subscriber = session.current!.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });
    
    session.current?.on("streamDestroyed", (event: StreamEvent) => {
      const streamManager = event.stream.streamManager;
      setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== streamManager));
    });
  }, []);

  /**
   * 세션 참여
   * @param token 토큰
   * @param userIdx 사용자 인덱스
   */
  const joinSession = useCallback(async (token: string, userIdx: number) => {
    await initOpenvidu();

    if (session.current?.connection?.connectionId) {
      console.error("이미 세션에 참여 중입니다.");
      return;
    }

    await fetchDevices();
    
    const audioSource = audioInputs[0]?.deviceId;
    const videoSource = videoInputs[0]?.deviceId;

    if (!audioSource || !videoSource) {
      console.error("입출력 장치를 찾을 수 없습니다.");
      return;
    }

    publisherProperties.current.audioSource = audioSource;
    publisherProperties.current.videoSource = videoSource;
  
    session.current = ov.current!.initSession();
    handleStreamEvents();

    await session.current.connect(token, { clientData: userIdx });

    const newPublisher = ov.current!.initPublisher(undefined, publisherProperties.current);
    await session.current.publish(newPublisher);
    setPublisher(newPublisher);
  }, [audioInputs, videoInputs, fetchDevices, handleStreamEvents, initOpenvidu]);

  /**
   * 세션 종료
   */
  const leaveSession = useCallback(() => {
    if (session.current) {
      publisher?.stream.getMediaStream().getTracks().forEach((track) => track.stop());
      
      session.current.disconnect();
      session.current = undefined;
    }

    ov.current = undefined;
    setPublisher(undefined);
    setSubscribers([]);
  }, [publisher]);

  /**
   * 장치 조회
   */
  const getDevices = useCallback(async () => {
    await fetchDevices();
  }, [fetchDevices]);

  /**
   * 장치 설정
   * @param device 장치
   */
  const setDevice = useCallback(async (device: Device) => {
    await initOpenvidu();

    if (!ov.current || !session.current) return;

    if (device.kind === "audioinput") {
      publisherProperties.current.audioSource = device.deviceId || false;
    } else if (device.kind === "videoinput") {
      publisherProperties.current.videoSource = device.deviceId || false;
    }

    const newPublisher = await ov.current.initPublisherAsync(undefined, publisherProperties.current);

    if (publisher) {
      await session.current.unpublish(publisher);
      setPublisher(undefined);
    }

    await session.current.publish(newPublisher);
    setPublisher(newPublisher);
  }, [publisher]);

  return (
    <OpenviduContext.Provider
      value={{
        ov: ov.current,
        session: session.current,
        publisherProperties: publisherProperties.current,
        publisher,
        subscribers,
        audioInputs,
        videoInputs,
        joinSession,
        leaveSession,
        getDevices,
        setDevice
      }}
    >
      {children}
    </OpenviduContext.Provider>
  );
};