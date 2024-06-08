export const getToken = async (customSessionId: string) => {
  let sessionId = await getSession(customSessionId);
  if (!sessionId) {
    sessionId = await createSession(customSessionId);
  }
  
  if (!sessionId) {
    throw new Error('Session ID is not valid');
  }

  const token = await createToken(sessionId);
  return token;
}

const getSession = async (customSessionId: string) => {
  const sessionId = await fetch('/api/openvidu/sessions/' + customSessionId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'customSessionId': customSessionId
    },
  })
    .then(response => response.json());
  return sessionId;
}

const createSession = async (customSessionId: string) => {
  const sessionId = await fetch('/api/openvidu/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'customSessionId': customSessionId
    },
  })
    .then(response => response.json());
  return sessionId;
}

const createToken = async (sessionId: string) => {
  const token = await fetch('/api/openvidu/sessions/' + sessionId + '/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => data.token);
  return token;
}