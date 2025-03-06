import axios from "axios";

interface RequestParams {
  provider: string;
}

export async function GET(request: Request, { params }: { params: RequestParams }) {
  const { provider } = params;

  // URL에서 'code' 파라미터 추출
  const { searchParams } = new URL(request.url);

  switch (provider) {
    case "naver":
      const naverClientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
      const naverClientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
      const naverCode = searchParams.get('code');
      const naverState = searchParams.get('state');

      // 토큰 발급
      const { data: tokenInfo } = await axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
          grant_type: 'authorization_code',
          client_id: naverClientId,
          client_secret: naverClientSecret,
          code: naverCode,
          state: naverState,
        },
      });

      // 사용자 정보 조회
      const { data: userInfo } = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
        },
      });
      if (userInfo.resultcode !== '00') {
        throw new Error(userInfo.message);
      }

      // 사용자 정보 추출
      /*
      const { isSuccess, userData } = await socialLogin(userInfo.response.provider, userInfo.response.id, userInfo.response.email, userInfo.response.name, userInfo.response.nickname);

      if (!isSuccess) {
        return Response.json({ error: '로그인에 실패했습니다.' }, { status: 400 });
      }
      */
      return Response.json(userInfo, { status: 200 });
    case "kakao":
      break;
    case "google":
      break;
  }    
}
