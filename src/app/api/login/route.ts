import { NextResponse } from 'next/server';
import { login } from '@/src/libs/auth';

export async function POST(request: Request) {
  try {
    const { username, password }: Credentials = await request.json();

    // 아이디 입력 여부 체크
    if (!username) {
      return NextResponse.json({ message: '아이디를 입력해주세요.' }, { status: 400 }); 
    }

    // 비밀번호 입력 여부 체크
    if (!password) {
      return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 로그인 요청
    const { isSuccess, userData, accessToken, refreshToken } = await login(username, password);

    // 로그인 실패 시
    if (!isSuccess) {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.' }, { status: 401 });
    }

    // 사용자 데이터가 존재하지 않을 경우
    if (!userData) {
      return NextResponse.json({ message: '사용자 데이터가 존재하지 않습니다.' }, { status: 400 });
    }

    // 토큰이 존재하지 않을 경우
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ message: '토큰이 존재하지 않습니다.' }, { status: 400 });
    }

    // 응답 생성 및 HTTP Only 쿠키에 세션 ID 설정
    const response = NextResponse.json({ message: '로그인 성공', userData });

    // AccessToken 쿠키 설정
    response.cookies.set('AccessToken', accessToken, {
      httpOnly: true, // 자바스크립트에서 접근 불가능
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 쿠키 전송
      sameSite: 'lax', // 쿠키 동작 방식
      path: '/', // 쿠키 적용 범위
      maxAge: 3600, // 1시간
    });

    // RefreshToken 쿠키 설정
    response.cookies.set('RefreshToken', refreshToken, {
      httpOnly: true, // 자바스크립트에서 접근 불가능
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 쿠키 전송
      sameSite: 'lax', // 쿠키 동작 방식
      path: '/', // 쿠키 적용 범위
      maxAge: 60 * 60 * 24 * 1, // 1일
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 401 });
  }
}
