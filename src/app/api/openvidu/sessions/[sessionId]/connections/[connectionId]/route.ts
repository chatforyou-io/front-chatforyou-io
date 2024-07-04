import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { sessionId: string, connectionId: string } }) {
  if (!params.sessionId || !params.connectionId) {
    return NextResponse.json({ error: '세션 아이디를 입력해야 합니다.' }, { status: 400 });
  }

  try {
    const data = await fetch(process.env.OPENVIDU_URL + '/api/sessions/' + params.sessionId + 'connection/' + params.connectionId, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.OPENVIDU_USERNAME + ':' + process.env.OPENVIDU_PASSWORD),
        'Content-Type': 'application/json',
        'Mode': 'no-cors',
        'RejectUnauthorized': 'false',
      }
    })
      .then(response => response.json());
      
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('세션 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '세션 생성에 실패했습니다.' }, { status: 500 });
  }
}
