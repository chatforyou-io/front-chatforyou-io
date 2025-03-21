import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export async function POST(request: NextRequest) {
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
