interface credentials {
  username: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  idx: number;
  userId: string;
  issuedAt: number;
  iss: string;
  exp: number;
}