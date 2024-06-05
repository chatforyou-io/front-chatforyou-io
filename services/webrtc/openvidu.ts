/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 *
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 *
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */
export async function getToken(state: OpenviduState) {
  const sessionId = await createSession(state.sessionId);
  console.log('sessionId', sessionId);
  return await createToken(sessionId);
}

export async function createSession(sessionId: string) {
  const data = await fetch('/api/openvidu/sessions', {
    method: 'POST',
    headers: { 'customSessionId': sessionId },
  })
    .then(response => response.json());
  console.log('createSession', data);
  return data.id;
}

export async function createToken(sessionId: string) {
  const data = await fetch('/api/openvidu/sessions/' + sessionId + '/connections', {
    method: 'POST',
  })
    .then(response => response.json());
  console.log('createToken', data);
  return data;
}