import { Device, OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
import { createContext, useState, ReactNode, useRef, use, useCallback } from 'react';

interface OpenviduContextType {
  ov: OpenVidu | undefined;
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[] | undefined;
  audioInputs: Device[] | undefined;
  videoInputs: Device[] | undefined;
  currentAudioInput: Device | undefined;
  currentVideoInput: Device | undefined
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
  currentAudioInput: undefined,
  currentVideoInput: undefined,
  joinSession: () => {},
  leaveSession: () => {},
  getDevices: () => {},
  setDevice: () => {},
});

export default function OpenviduProvider({ children }: { children: ReactNode }) {
  const ov = useRef<OpenVidu>();
  const session = useRef<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);
  const [currentAudioInput, setCurrentAudioInput] = useState<Device>();
  const [currentVideoInput, setCurrentVideoInput] = useState<Device>();

  const initOpenvidu = async () => {
    if (!ov.current) {
      ov.current = new OpenVidu();
      ov.current.enableProdMode();
    }
  }

  const joinSession = useCallback(async (token: string, userIdx: number) => {
    await initOpenvidu();

    if (session.current?.connection?.connectionId) {
      console.error("이미 세션에 참여 중입니다.");
      return;
    }

    const devices = await ov.current!.getDevices();
    const audioDevices = devices.filter((device) => device.kind === 'audioinput');
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    if (!audioDevices.length || !videoDevices.length) {
      console.error("디바이스가 없습니다.");
      return;
    }

    setCurrentAudioInput(audioDevices[0]);
    setCurrentVideoInput(videoDevices[0]);
  
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
      audioSource: audioDevices[0].deviceId,
      videoSource: videoDevices[0].deviceId,
      publishAudio: true,
      publishVideo: true,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

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
    const audioDevices = devices.filter((device) => device.kind === 'audioinput');
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    
    setAudioInputs(audioDevices);
    setVideoInputs(videoDevices);
  }, []);

  const setDevice = useCallback(async (device: Device) => {
    await initOpenvidu();

    if (device.kind === 'audioinput') {
      setCurrentAudioInput(device);
    } else if (device.kind === 'videoinput') {
      setCurrentVideoInput(device);
    }

    const newPublisher = await ov.current!.initPublisherAsync(undefined, {
      audioSource: device.kind === 'audioinput' ? device.deviceId : currentAudioInput?.deviceId,
      videoSource: device.kind === 'videoinput' ? device.deviceId : currentVideoInput?.deviceId,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    });

    if (!session.current) return;

    if (publisher) {
      await session.current.unpublish(publisher);
    }

    await session.current.publish(newPublisher);

    setPublisher(newPublisher);
  }, []);

  return (
    <OpenviduContext.Provider value={{ ov: ov.current, session: session.current, publisher, subscribers, audioInputs, videoInputs, currentAudioInput, currentVideoInput, joinSession, leaveSession, getDevices, setDevice }}>
      {children}
    </OpenviduContext.Provider>
  );
};