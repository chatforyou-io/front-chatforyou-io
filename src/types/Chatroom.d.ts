interface Chatroom {
  userIdx?: number,
  sessionId?: string,
  roomName: string,
  description?: string,
  pwd: string,
  usePwd: boolean,
  usePrivate?: boolean,
  useRtc?: boolean,
  currentUserCount?: number,
  maxUserCount: number,
}