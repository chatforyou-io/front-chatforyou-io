interface OpenViduContextType {
  ov: OpenVidu | null;
  session: Session | null;
  publisher: Publisher | null;
  subscribers: Subscriber[];
  audioInputs: Device[];
  videoInputs: Device[];
  initSession: () => void;
  joinSession: (token: string, userIdx: number) => void;
  leaveSession: () => void;
  getDevices: () => void;
  setDevice: (device: Device) => void;
}