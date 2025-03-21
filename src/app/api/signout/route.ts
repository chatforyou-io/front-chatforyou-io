import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // AccessToken 쿠키 삭제
    cookies().delete("AccessToken");

    // RefreshToken 쿠키 삭제
    cookies().delete("RefreshToken");
    
    // SessionToken 쿠키 삭제
    cookies().delete("SessionToken");

    return NextResponse.json({ isSuccess: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isSuccess: false });
  }
}
