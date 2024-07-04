interface OpenviduState {
  mySessionId: string,
  myUserName: string,
  session: Session | undefined,
  currentVideoDevice: Device | undefined,
  mainStreamManager: StreamManager | undefined,
  publisher: Publisher | undefined,
  subscribers: Subscriber[],
}