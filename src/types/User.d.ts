interface User {
  provider?: string,
  idx?: number,
  id: string,
  pwd?: string,
  confirmPwd?: string,
  usePwd?: boolean,
  name?: string,
  nickName?: string,
  create_date?: Date,
  accesstoken?: string,
  refreshtoken?: string,
}