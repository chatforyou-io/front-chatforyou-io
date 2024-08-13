'use server';

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ':' + authPassword);

const userCreate = async (user: User) => {
  try {
    const data = await fetch(`${authHost}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
      body: JSON.stringify(user),
    }).then(response => {
      if (!response.ok) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      }
      return response.json();
    });

    /*
      {
        result: 'success',
        user_data: {
          idx: number,
          id: string,
          pwd: string,
          usePwd: boolean,
          nickName: string,
          name: string
        }
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail create' };
  }
};

const userUpdate = async (user: User) => {
  try {
    const data = await fetch(`${authHost}/user/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
      body: JSON.stringify(user),
    }).then(response => {
      if (!response.ok) {
        throw new Error('서버와의 통신 중 오류가 발생했습니다.');
      }
      return response.json();
    });

    /*
      {
        result: 'success',
        user_data: {
          idx: number,
          id: string,
          pwd: string,
          usePwd: boolean,
          nickName: string,
          name: string
        }
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail update' };
  }
};

const userDelete = async (id: string) => {
  try {
    const data = await fetch(`${authHost}/user/delete?id=${id}`, {
      method: 'DELETE',
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

    /*
      {
        "result": "success"
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail delete user' };
  }
};

const userInfo = async (id: string, pwd: string) => {
  try {
    const querysting = new URLSearchParams({ id, pwd }).toString();
    const data = await fetch(`${authHost}/user/info?${querysting}`, {
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

    /*
      {
        result: 'success',
        user_data: {
          idx: number,
          id: string,
          usePwd: boolean,
          nickName: string,
          name: string
        }
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error('fail info: ' + error);
    return { isSuccess: false, result: 'fail info' };
  }
};

const userCheckNickname = async (nickname: string) => {
  try {
    const data = await fetch(`${authHost}/user/check_nick_name?nickName=${nickname}`, {
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

    /*
      {
        result: 'success',
        isDuplicate: boolean
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail validate' };
  }
};

const userValidate = async (email: string) => {
  try {
    const apiResponse = await fetch(`${authHost}/auth/validate?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
    });
  
    if (!apiResponse.ok) {
      throw new Error('서버와의 통신 중 오류가 발생했습니다.');
    }

    const data = await apiResponse.json();

    let mailCode = '';
    const setCookieHeader = apiResponse.headers.get('set-Cookie');
    if (setCookieHeader) {
      // 쿠키 문자열을 파싱하여 'mailCode' 키의 값을 찾습니다.
      const cookies = setCookieHeader.split(';').map(cookie => cookie.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith('mailCode=')) {
          mailCode = cookie.split('=')[1];
          break;
        }
      }
    }

    /*
      {
        result: 'send success'
      }
    */
    return {
      isSuccess: true,
      result: data.result,
      mailCode: mailCode,
    };
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail validate' };
  }
};

export { userCreate, userUpdate, userDelete, userInfo, userCheckNickname, userValidate };