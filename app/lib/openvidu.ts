import axios from "axios";

const OPENVIDU_HOST = process.env.NEXT_PUBLIC_OPENVIDU_HOST!;
const OPENVIDU_USERNAME = process.env.NEXT_PUBLIC_OPENVIDU_USERNAME!;
const OPENVIDU_PASSWORD = process.env.NEXT_PUBLIC_OPENVIDU_PASSWORD!;
const OPENVIDU_CREDENTIALS = btoa(OPENVIDU_USERNAME + ':' + OPENVIDU_PASSWORD);

export const getToken = async (mySessionId: string) => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
}

const createSession = async (sessionId: string) => {
  const data = await fetch(OPENVIDU_HOST + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
      'Access-Control-Allow-Origin': OPENVIDU_HOST,
      'Access-Control-Allow-Credentials': 'true',
      'rejectUnauthorized': 'false',
    },
    body: JSON.stringify({ customSessionId: sessionId }),
  }).then((response) => response.json());
  return data.id; // The sessionId
}

const createToken = async (sessionId: string) => {
  const data = await fetch(OPENVIDU_HOST + '/api/sessions/' + sessionId + '/connection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + OPENVIDU_CREDENTIALS,
      'Access-Control-Allow-Origin': OPENVIDU_HOST,
      'Access-Control-Allow-Credentials': 'true',
      'rejectUnauthorized': 'false',
    },
  }).then((response) => response.json());
  return data.token; // The token
}