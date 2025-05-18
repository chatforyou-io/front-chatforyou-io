// 로그인 요청 타입
interface Credentials {
  username: string;
  password: string;
}

// 토큰 타입
interface AccessTokenType {
  sub: string;
  idx: number;
  userId: string;
  issuedAt: number;
  iss: string;
  exp: number;
}

interface RefreshTokenType {
  sub: string;
  idx: number;
  iss: string;
  exp: number;
}

interface SessionTokenType extends User {}