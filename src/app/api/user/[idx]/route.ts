import { NextResponse } from 'next/server';
import { userInfo } from '@/src/libs/user';

export async function GET(request: Request, { params }: { params: { idx: string } }) {
  try {
    const { idx } = params;

    // 아이디 입력 여부 체크
    if (!idx) {
      return NextResponse.json({ message: '잘못된 접근입니다.' }, { status: 400 }); 
    }

    // 사용자 정보 조회
    const { isSuccess, userData } = await userInfo(idx, '');

    // 로그인 실패 시
    if (!isSuccess) {
      return NextResponse.json({ message: '사용자 정보를 조회할 수 없습니다.' }, { status: 401 });
    }

    // 사용자 데이터가 존재하지 않을 경우
    if (!userData) {
      return NextResponse.json({ message: '사용자 정보가 존재하지 않습니다.' }, { status: 400 });
    }

    // 응답 생성
    return NextResponse.json({ message: '사용자 정보 조회 성공', userData });
  } catch (error) {
    return NextResponse.json({ message: '사용자 정보 조회에 실패했습니다.' }, { status: 401 });
  }
}
