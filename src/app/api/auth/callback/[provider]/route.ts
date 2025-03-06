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
      const { data: tokenData } = await axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
          grant_type: 'authorization_code',
          client_id: naverClientId,
          client_secret: naverClientSecret,
          code: naverCode,
          state: naverState,
        },
      });
      const { access_token, refresh_token, token_type, expires_in } = tokenData;

      // 사용자 정보 조회
      const { data: userInfoData } = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { resultcode, message, response } = userInfoData;
      if (resultcode !== '00') {
        throw new Error(message);
      }

      // 사용자 정보 추출
      const { id, nickname, profile_image, age, gender, email, mobile, mobile_e164, name, birthday, birthyear } = response;
      console.log(id, nickname, profile_image, age, gender, email, mobile, mobile_e164, name, birthday, birthyear);
      break;
    case "kakao":
      break;
    case "google":
      break;
  }    
}
