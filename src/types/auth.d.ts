// 로그인 요청 타입
interface credentials {
  username: string;
  password: string;
}

// 토큰 타입
interface JwtPayload {
  sub: string;
  idx: number;
  userId: string;
  issuedAt: number;
  iss: string;
  exp: number;
}

// 로그인 응답 타입
interface LoginResponse {
  isSuccess: boolean;
  userData?: UserData;
  accessToken?: string;
  refreshToken?: string;
  code?: number;
  message?: string;
}

// 사용자 데이터 타입
interface UserData {
  idx: number;
  id: string;
  pwd: string;
  name: string;
  nickName: string;
  provider: string;
  friendList: string | null;
  createDate: string | null;
  lastLoginDate: number;
  accessToken: string;
  refreshToken: string;
}

// 이메일 유효성 검사 응답 타입
interface ValidateResponse {
  isSuccess: boolean;
  result?: boolean;
  mailCode?: string;
  code?: number;
  message?: string;
}

