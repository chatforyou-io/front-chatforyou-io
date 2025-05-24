interface OpenViduContextType {
  ov: OpenVidu | null;
  session: Session | null;
  publisher: Publisher | null;
  subscribers: Subscriber[];
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  selectedAudio: string | undefined;
  selectedVideo: string | undefined;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  changeAudioDevice: (deviceId: string) => void;
  changeVideoDevice: (deviceId: string) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  initSession: () => Promise<void>;
  joinSession: (token: string, userIdx: number) => Promise<void>;
  leaveSession: () => Promise<void>;
}