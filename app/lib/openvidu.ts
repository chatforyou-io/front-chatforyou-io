export const getToken = async (customSessionId: string) => {
  let session = await getSession(customSessionId);
  if (session.error) {
    session = await createSession(customSessionId);
  }
  
  if (!session) {
    throw new Error('Session ID is not valid');
  }

  const connection = await createConnection(session.sessionId);
  return connection.token;
}

const getSession = async (customSessionId: string) => {
  const session = await fetch('/api/openvidu/sessions/' + customSessionId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'customSessionId': customSessionId
    },
  })
    .then(response => response.json());
  return session;
}

const createSession = async (customSessionId: string) => {
  const session = await fetch('/api/openvidu/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'customSessionId': customSessionId
    },
  })
    .then(response => response.json());
  return session;
}

const createConnection = async (sessionId: string) => {
  const connection = await fetch('/api/openvidu/sessions/' + sessionId + '/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json());
  return connection;
}