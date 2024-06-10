import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const customSessionId = req.headers.get('customSessionId');

  if (!customSessionId) {
    return NextResponse.json({ error: '세션 아이디를 입력해야 합니다.' }, { status: 400 });
  }

  try {
    const data = await fetch(process.env.OPENVIDU_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.OPENVIDU_USERNAME + ':' + process.env.OPENVIDU_PASSWORD),
        'Content-Type': 'application/json',
        'Mode': 'no-cors',
        'RejectUnauthorized': 'false',
      },
      body: JSON.stringify({ customSessionId: customSessionId }),
    })
      .then(response => response.json());
    console.log('세션 생성');
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
