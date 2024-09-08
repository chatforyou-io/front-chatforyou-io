"use server";

const OPENVIDU_HOST = process.env.OPENVIDU_HOST!;
const OPENVIDU_USERNAME = process.env.OPENVIDU_USERNAME!;
const OPENVIDU_PASSWORD = process.env.OPENVIDU_PASSWORD!;
const OPENVIDU_CREDENTIALS = btoa(OPENVIDU_USERNAME + ':' + OPENVIDU_PASSWORD);

const requestToken = async (sessionId: string, userIdx: number) => {
  const data = await fetch(OPENVIDU_HOST + '/chatforyouio/chatroom/join/' + sessionId + '?user_idx=' + userIdx, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
    },
  }).then((response) => response.json());
  return data.joinData.joinUserInfo.camera_token; // The token
}

export { requestToken };