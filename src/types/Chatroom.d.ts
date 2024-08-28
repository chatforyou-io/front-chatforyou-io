interface Chatroom {
  userIdx: number,
  sessionId: string,
  roomName: string,
  pwd: string,
  usePwd: boolean,
  usePrivate: boolean,
  useRtc: boolean,
  currentUserCount: number,
  maxUserCount: number,
}