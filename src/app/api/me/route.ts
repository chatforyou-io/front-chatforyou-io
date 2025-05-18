import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { refreshToken, signOut } from "@/src/libs/auth";
import { userUpdate, userDelete } from "@/src/libs/user";

const JWT_SECRET = process.env.JWT_SECRET || '';

async function GET() {
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
      const { isSuccess, accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshToken(idx, id);

      if (!isSuccess) {
        return NextResponse.json({ message: "액세스 토큰 갱신에 실패했습니다." }, { status: 401 });
      }

      if (!newAccessToken || !newRefreshToken) {
        return NextResponse.json({ message: "액세스 토큰 갱신에 실패했습니다." }, { status: 401 });
      }

      // 인증 관련 쿠키 설정
      setAuthCookies(newAccessToken, newRefreshToken, sessionToken);
    }

    // 세션 토큰 데이터 생성
    const session = { idx, id, pwd, name, nickName, provider, friendList, createDate, lastLoginDate }

    // 응답 생성
    return NextResponse.json({ message: "로그인에 성공했습니다.", session }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "로그인에 실패했습니다." }, { status: 401 });
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

    // session 토큰 생성
    const sessionToken = jwt.sign(userData, JWT_SECRET, { expiresIn: "1h" });

    // 세션 토큰 데이터 생성
    cookies().set("SessionToken", sessionToken, {
      httpOnly: true, // 자바스크립트에서 접근 불가능
      secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 쿠키 전송
      sameSite: "lax", // 쿠키 동작 방식
      path: "/", // 쿠키 적용 범위
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1시간
    });

    return NextResponse.json({ message: "사용자 정보 수정에 성공했습니다." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "사용자 정보 수정에 실패했습니다." }, { status: 400 });
  }
}

async function DELETE(request: NextRequest) {
  const { idx, id } = await request.json();
  
  try {
    const { isSuccess } = await userDelete(idx);

    if (!isSuccess) {
      return NextResponse.json({ message: "사용자 정보 삭제에 실패했습니다." }, { status: 400 });
    }

    // 로그아웃 요청
    await signOut(idx, id);

    // 인증 관련 쿠키 삭제
    deleteAuthCookies();

    return NextResponse.json({ message: "사용자 정보 삭제에 성공했습니다." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "사용자 정보 삭제에 실패했습니다." }, { status: 400 });
  }
}

export { GET, PATCH, DELETE };

// 인증 관련 쿠키 설정
function setAuthCookies(accessToken: string, refreshToken: string, sessionToken: string) {
  cookies().set("AccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookies().set("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookies().set("SessionToken", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

// 인증 관련 쿠키 삭제
function deleteAuthCookies() {
  cookies().delete("AccessToken");
  cookies().delete("RefreshToken");
  cookies().delete("SessionToken");
}
