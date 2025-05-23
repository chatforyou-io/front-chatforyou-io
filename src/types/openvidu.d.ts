interface OpenViduContextType {
  ov: OpenVidu | undefined;
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  audioInputs: Device[];
  videoInputs: Device[];
  publisherProperties: PublisherProperties | undefined;
  joinSession: (token: string, userIdx: number) => void;
  leaveSession: () => void;
  getDevices: () => void;
  setDevice: (device: Device) => void;
}