import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authHost = process.env.API_AUTH_HOST;

export async function POST(req: NextRequest) {
  const user: User = await req.json();

  try {
    const data = await fetch(`${authHost}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }).then(response => {
      if (!response.ok) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      }
      return response.json();
    });

    /*
      {
        result: 'success',
        user_data: {
          idx: number,
          id: string,
          pwd: string,
          usePwd: boolean,
          nickName: string,
          name: string
        }
      }
    */
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('fail create user: ' + error);
    return NextResponse.json({ result: 'fail create user' }, { status: 501 });
  }
}