import { login } from '@/src/libs/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password }: credentials = await request.json();

    // 아이디 입력 여부 체크
    if (!username) {
      return NextResponse.json({ message: '아이디를 입력해주세요.' }, { status: 400 }); 
    }

    // 비밀번호 입력 여부 체크
    if (!password) {
      return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 로그인 요청
    const { isSuccess, userData } = await login(username, password);

    // 로그인 실패 시
    if (!isSuccess) {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.' }, { status: 401 });
    }

    // 응답 생성 및 HTTP Only 쿠키에 세션 ID 설정
    const response = NextResponse.json({ message: '로그인 성공' });
    response.cookies.set('userIdx', userData.idx.toString(), {
      httpOnly: true, // 자바스크립트에서 접근 불가능
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 쿠키 전송
      sameSite: 'lax', // 쿠키 동작 방식
      path: '/', // 쿠키 적용 범위
      maxAge: 3600, // 1시간
    });
    return response;
  } catch (error) {
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 401 });
  }
}
