import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {
  if (!params.sessionId) {
    return NextResponse.json({ error: '세션 아이디를 입력해야 합니다.' }, { status: 400 });
  }

  try {
    const data = await fetch(process.env.OPENVIDU_URL + '/api/sessions/' + params.sessionId + '/connections', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.OPENVIDU_USERNAME + ':' + process.env.OPENVIDU_PASSWORD),
        'Content-Type': 'application/json',
        'Mode': 'no-cors',
      }
    })
      .then(response => response.json());
    console.log(data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('세션 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '세션 생성에 실패했습니다.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello World!' }, { status: 200 });
}
