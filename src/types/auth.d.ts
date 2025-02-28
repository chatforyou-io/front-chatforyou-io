// 로그인 요청 타입
interface Credentials {
  username: string;
  password: string;
}

// 토큰 타입
interface AccessTokenType extends JwtPayload {
  sub: string;
  idx: number;
  userId: string;
  issuedAt: number;
  iss: string;
  exp: number;
}

interface RefreshTokenType extends JwtPayload {
  sub: string;
  idx: number;
  iss: string;
  exp: number;
}

interface SessionTokenType extends JwtPayload {
  idx: number;
  id: string;
  pwd: string;
  name: string;
  nickName: string;
  provider: string;
  friendList: string | null;
  createDate: string | null;
  lastLoginDate: number;
  iss: string;
  exp: number;
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
