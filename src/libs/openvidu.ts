"use server";

const OPENVIDU_HOST = process.env.OPENVIDU_HOST!;
const OPENVIDU_USERNAME = process.env.OPENVIDU_USERNAME!;
const OPENVIDU_PASSWORD = process.env.OPENVIDU_PASSWORD!;
const OPENVIDU_CREDENTIALS = btoa(OPENVIDU_USERNAME + ':' + OPENVIDU_PASSWORD);

const createToken = async (sessionId: string) => {
  try {
    const data = await fetch(`${OPENVIDU_HOST}/openvidu/api/sessions/${sessionId}/connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${OPENVIDU_CREDENTIALS}`,
      },
    })
    .then((response) => response.json());

    if (!data) {
      throw new Error('Failed to create session');
    }

    return data.token;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create session');
  }
}

const requestToken = async (sessionId: string, userIdx: number) => {
  try {
    const data = await fetch(OPENVIDU_HOST + '/chatforyouio/chatroom/join/' + sessionId + '?user_idx=' + userIdx, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
      },
    })
    .then((response) => response.json());

    if (data.result === 'success') {
      return data.joinData.joinUserInfo.camera_token;
    } else {
      throw new Error('Failed to request token');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to request token');
  }
}

export { createToken, requestToken };