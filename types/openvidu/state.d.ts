interface OpenviduState {
  sessionId: string,
  userName: string,
  session: Session | undefined,
  currentVideoDevice: Device | undefined,
  mainStreamManager: StreamManager | undefined,
  publisher: Publisher | undefined,
  subscribers: Subscriber[],
}