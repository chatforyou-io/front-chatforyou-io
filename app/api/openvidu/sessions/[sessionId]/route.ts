import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  if (!params.sessionId) {
    return NextResponse.json({ error: '세션 아이디를 입력해야 합니다.' }, { status: 400 });
  }

  try {
    const sessionId = await fetch(process.env.OPENVIDU_URL + '/api/sessions/' + params.sessionId, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.OPENVIDU_USERNAME + ':' + process.env.OPENVIDU_PASSWORD),
        'Content-Type': 'application/json',
        'Mode': 'no-cors',
      }
    })
      .then(response => response.json())
      .then(data => data.id);
      
    return NextResponse.json(sessionId, { status: 201 });
  } catch (error) {
    console.error('세션 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '세션 생성에 실패했습니다.' }, { status: 500 });
  }
}
