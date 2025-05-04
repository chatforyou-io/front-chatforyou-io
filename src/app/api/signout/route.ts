import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOut } from "@/src/libs/auth";

export async function POST() {
  try {
    // AccessToken 쿠키 삭제
    cookies().delete("AccessToken");

    // RefreshToken 쿠키 삭제
    cookies().delete("RefreshToken");
    
    // SessionToken 쿠키 삭제
    cookies().delete("SessionToken");

    // 로그아웃 요청
    const { isSuccess } = await signOut();

    return NextResponse.json({ isSuccess });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isSuccess: false });
  }
}
