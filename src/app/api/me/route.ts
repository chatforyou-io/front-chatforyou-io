import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { refreshToken } from "@/src/libs/auth";
import { userUpdate, userDelete } from "@/src/libs/user";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

async function GET(request: NextRequest) {
  try {
    // 토큰 쿠키 가져오기
    const accessToken = cookies().get("AccessToken")?.value;
    const sessionToken = cookies().get("SessionToken")?.value;
    
    if (!accessToken || !sessionToken) {
      return NextResponse.json({ message: "토큰이 존재하지 않습니다." }, { status: 200 });
    }

    // 액세스 토큰 디코딩
    const decodedAccessToken = jwt.decode(accessToken) as AccessTokenType;
    const { exp } = decodedAccessToken;

    // 세션 토큰 디코딩
    const decodedSessionToken = jwt.decode(sessionToken) as SessionTokenType;
    const { idx, id, pwd, name, nickName, provider, friendList, createDate, lastLoginDate } = decodedSessionToken;

    // 액세스 토큰 만료 시간 체크
    if (exp < Date.now() / 1000) {
      const { isSuccess, accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshToken(idx, id);

      if (!isSuccess) {
        return NextResponse.redirect(new URL(`${DOMAIN}/chatforyouio/front`, request.url));
      }

      if (!newAccessToken || !newRefreshToken) {
        return NextResponse.redirect(new URL(`${DOMAIN}/chatforyouio/front`, request.url));
      }

      // AccessToken 쿠키 설정
      cookies().set("AccessToken", newAccessToken, {
        httpOnly: true, // 자바스크립트에서 접근 불가능
        secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 쿠키 전송
        sameSite: "lax", // 쿠키 동작 방식
        path: "/", // 쿠키 적용 범위
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1시간
      });

      // RefreshToken 쿠키 설정
      cookies().set("RefreshToken", newRefreshToken, {
        httpOnly: true, // 자바스크립트에서 접근 불가능
        secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 쿠키 전송
        sameSite: "lax", // 쿠키 동작 방식
        path: "/", // 쿠키 적용 범위
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1일
      });
    }

    // 세션 토큰 데이터 생성
    const session = { idx, id, pwd, name, nickName, provider, friendList, createDate, lastLoginDate }

    // 응답 생성
    return NextResponse.json({ message: "로그인에 성공했습니다.", session }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL(`${DOMAIN}/chatforyouio/front`, request.url));
  }
}

async function PATCH(request: NextRequest) {
  const { idx, nickName } = await request.json();

  try {
    const { isSuccess, userData } = await userUpdate(idx, nickName);

    if (!isSuccess) {
      return NextResponse.json({ message: "사용자 정보 수정에 실패했습니다." }, { status: 400 });
    }
    
    if (!userData) {
      return NextResponse.json({ message: "사용자 정보 수정에 실패했습니다." }, { status: 400 });
    }

    // 세션 토큰 데이터 생성
    const session = {
      idx: userData.idx,
      id: userData.id,
      pwd: userData.pwd,
      name: userData.name,
      nickName: userData.nickName,
      provider: userData.provider,
      friendList: userData.friendList,
      createDate: userData.createDate,
      lastLoginDate: userData.lastLoginDate
    }

    return NextResponse.json({ message: "사용자 정보 수정에 성공했습니다.", session }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "사용자 정보 수정에 실패했습니다." }, { status: 400 });
  }
}

async function DELETE(request: NextRequest) {
  const { idx } = await request.json();
  
  try {
    const { isSuccess } = await userDelete(idx);

    if (!isSuccess) {
      return NextResponse.json({ message: "사용자 정보 삭제에 실패했습니다." }, { status: 400 });
    }

    // AccessToken 쿠키 삭제
    cookies().delete("AccessToken");

    // RefreshToken 쿠키 삭제
    cookies().delete("RefreshToken");
    
    // SessionToken 쿠키 삭제
    cookies().delete("SessionToken");

    return NextResponse.json({ message: "사용자 정보 삭제에 성공했습니다." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "사용자 정보 삭제에 실패했습니다." }, { status: 400 });
  }
}

export { GET, PATCH, DELETE };