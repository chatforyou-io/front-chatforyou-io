'use server';

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ':' + authPassword);

const chatroomCreate = async (chatroom: Chatroom) => {
  try {
    if (chatroom.usePwd && !chatroom.pwd) {
      throw new Error('비밀번호를 입력해주세요.');
    }

    chatroom.pwd = btoa(chatroom.pwd);
    
    const data = await fetch(`${authHost}/chatroom/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
      body: JSON.stringify(chatroom),
    }).then(response => {
      if (!response.ok) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      }
      return response.json();
    });
    
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false, result: 'fail create' };
  }
};

const chatroomList = async () => {
  try {
    const data = await fetch(`${authHost}/chatroom/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      }
      return response.json();
    });
    
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false, result: 'fail list' };
  }
};

const chatroomInfo = async (sessionId: string) => {
  try {
    const data = await fetch(`${authHost}/chatroom/info/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      }
      return response.json();
    });

    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error(error);
    return { isSuccess: false, result: 'fail info' };
  }
};


export { chatroomCreate, chatroomList, chatroomInfo };