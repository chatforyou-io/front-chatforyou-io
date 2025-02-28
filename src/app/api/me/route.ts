import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(request: Request) {
  try {
    // 토큰 쿠키 가져오기
    const accessToken = cookies().get("AccessToken")?.value;
    const sessionToken = cookies().get("SessionToken")?.value;
    
    if (!accessToken || !sessionToken) {
      return NextResponse.json({ message: "토큰이 존재하지 않습니다." }, { status: 401 });
    }

    // 액세스 토큰 디코딩
    const decodedAccessToken = jwt.decode(accessToken) as AccessTokenType;
    const { exp } = decodedAccessToken;

    // 세션 토큰 디코딩
    const decodedSessionToken = jwt.decode(sessionToken) as SessionTokenType;
    const { idx, id, pwd, name, nickName, provider, friendList, createDate, lastLoginDate } = decodedSessionToken;

    // 액세스 토큰 만료 시간 체크
    if (exp < Date.now() / 1000) {
      return NextResponse.json({ message: "토큰이 만료되었습니다." }, { status: 401 });
    }

    // 세션 토큰 데이터 생성
    const session = {
      idx,
      id,
      pwd,
      name,
      nickName,
      provider,
      friendList,
      createDate,
      lastLoginDate
    }

    // 응답 생성
    return NextResponse.json({ message: "로그인에 성공했습니다.", session });
  } catch (error) {
    return NextResponse.json({ message: "로그인에 실패했습니다." }, { status: 401 });
  }
}
