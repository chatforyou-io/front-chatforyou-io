import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOut } from "@/src/libs/auth";

export async function POST(request: Request) {
  const { idx, id } = await request.json();

  try {
    // 로그아웃 요청
    await signOut(idx, id);

    // 인증 관련 쿠키 삭제
    deleteAuthCookies();

    return NextResponse.json({ isSuccess: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isSuccess: false });
  }
}

// 인증 관련 쿠키 삭제
function deleteAuthCookies() {
  cookies().delete("AccessToken");
  cookies().delete("RefreshToken");
  cookies().delete("SessionToken");
}

