interface OpenViduContextType {
  ov: OpenVidu | null;
  session: Session | null;
  publisher: Publisher | null;
  subscribers: Subscriber[];
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  initSession: () => void;
  joinSession: (token: string, userIdx: number) => Promise<void>;
  leaveSession: () => void;
  setDevice: (device: MediaDeviceInfo) => void;
}