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
  const [audioInputs, setAudioInputs] = useState<Device[]>();
  const [videoInputs, setVideoInputs] = useState<Device[]>();
  const [currentAudioInput, setCurrentAudioInput] = useState<Device>();
  const [currentVideoInput, setCurrentVideoInput] = useState<Device>();

  const joinSession = useCallback(async (token: string, userIdx: number) => {
    if (!currentAudioInput || !currentVideoInput) return;

    if (!ov.current) {
      ov.current = new OpenVidu();
      ov.current.enableProdMode();
    }

    if (!session.current || !session.current.connection || !session.current.connection.connectionId) {
      session.current = ov.current.initSession();

      session.current.on('streamCreated', (event) => {
        const streamManager = event.stream.streamManager;
        if (session.current && streamManager && streamManager.stream.connection.connectionId !== session.current.connection.connectionId) {
          const subscriber = session.current.subscribe(event.stream, undefined);
          setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        }
      });

      session.current.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) => prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager));
      });

      await session.current.connect(token, { clientData: userIdx });

      const newPublisher = ov.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      });

      await session.current.publish(newPublisher);

      setPublisher(newPublisher);
    }
  }, [currentAudioInput, currentVideoInput]);

  const leaveSession = useCallback(() => {
    if (session.current) {
      session.current.disconnect();
      session.current = undefined;
    }

    setPublisher(undefined);
    setSubscribers([]);

    ov.current = undefined;
  }, [setPublisher, setSubscribers]);

  const getDevices = useCallback(async () => {
    if (!ov.current) {
      ov.current = new OpenVidu();
      ov.current.enableProdMode();
    }

    const devices = await ov.current.getDevices();
    const audioDevices = devices.filter((device) => device.kind === 'audioinput');
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    
    setAudioInputs(audioDevices);
    setVideoInputs(videoDevices);

    if (audioDevices.length > 0) {
      setCurrentAudioInput(audioDevices[0]);
    }
    if (videoDevices.length > 0) {
      setCurrentVideoInput(videoDevices[0]);
    }
  }, []);

  const setDevice = useCallback(async (device: Device) => {
    if (!ov.current) {
      ov.current = new OpenVidu();
      ov.current.enableProdMode();
    }

    if (device.kind === 'audioinput') {
      setCurrentAudioInput(device);
    } else if (device.kind === 'videoinput') {
      setCurrentVideoInput(device);
    }

    const newPublisher = await ov.current.initPublisherAsync(undefined, {
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
  }, [currentAudioInput, currentVideoInput, publisher]);

  return (
    <OpenviduContext.Provider value={{ ov: ov.current, session: session.current, publisher, subscribers, audioInputs, videoInputs, currentAudioInput, currentVideoInput, joinSession, leaveSession, getDevices, setDevice }}>
      {children}
    </OpenviduContext.Provider>
  );
};