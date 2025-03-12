interface User {
  provider?: string,
  idx?: number,
  id: string,
  pwd?: string,
  confirmPwd?: string,
  usePwd?: boolean,
  name?: string,
  nickName?: string,
  friendList?: string[],
  createDate?: Date,
  lastLoginDate?: Date,
}