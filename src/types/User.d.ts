interface UserResponse {
  isSuccess: boolean,
  result?: string,
  userData?: User,
  code?: number,
  message?: string
}

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
  accessToken?: string,
  refreshToken?: string,
  lastLoginDate?: number | null
}