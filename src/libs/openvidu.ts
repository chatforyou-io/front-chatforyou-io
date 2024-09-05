"use server";

const OPENVIDU_HOST = process.env.OPENVIDU_HOST!;
const OPENVIDU_USERNAME = process.env.OPENVIDU_USERNAME!;
const OPENVIDU_PASSWORD = process.env.OPENVIDU_PASSWORD!;
const OPENVIDU_CREDENTIALS = btoa(OPENVIDU_USERNAME + ':' + OPENVIDU_PASSWORD);

const getToken = async (mySessionId: string) => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
}

const createSession = async (sessionId: string) => {
  const data = await fetch(OPENVIDU_HOST + '/openvidu/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
    },
    body: JSON.stringify({ customSessionId: sessionId }),
  }).then((response) => response.json());
  return data.id; // The sessionId
}

const joinSession = async (sessionId: string, userIdx: number) => {
  const data = await fetch(OPENVIDU_HOST + '/chatroom/join/' + sessionId + '?user_idx=' + userIdx, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
    },
  }).then((response) => response.json());
  return data.token; // The token
}

const createToken = async (sessionId: string) => {
  const data = await fetch(OPENVIDU_HOST + '/openvidu/api/sessions/' + sessionId + '/connection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
    },
  }).then((response) => response.json());
  return data.token; // The token
}

export { getToken, createSession, createToken };