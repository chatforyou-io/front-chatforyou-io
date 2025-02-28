import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 응답 생성 및 HTTP Only 쿠키에 세션 ID 설정
    const response = NextResponse.json({ message: "로그아웃 성공" });

    // AccessToken 쿠키 삭제
    cookies().delete("AccessToken");

    // RefreshToken 쿠키 삭제
    cookies().delete("RefreshToken");
    
    // SessionToken 쿠키 삭제
    cookies().delete("SessionToken");

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "로그아웃에 실패했습니다." }, { status: 401 });
  }
}
