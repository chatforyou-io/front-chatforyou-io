'use server';

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ':' + authPassword);

const userCreate = async (user: User) => {
  try {
    const data = await fetch(`${authHost}/auth/create`, {
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

    data.isSuccess = true;
    return data; // { isSuccess: true, result: 'send success' }
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail create' };
  }
};

const userUpdate = async (user: User) => {
  try {
    const data = await fetch(`${authHost}/auth/update`, {
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

    data.isSuccess = true;
    return data; // { isSuccess: true, result: 'send success' }
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail update' };
  }
};

const userDelete = async (id: string) => {
  try {
    const data = await fetch(`${authHost}/auth/delete/${id}`, {
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

    data.isSuccess = true;
    return data; // { isSuccess: true, result: 'send success' }
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail delete' };
  }
};

const userInfo = async (id: string) => {
  try {
    const data = await fetch(`${authHost}/auth/info/${id}`, {
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
    return data; // { isSuccess: true, result: 'send success' }
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail info' };
  }
};

const userValidate = async (id: string) => {
  try {
    const data = await fetch(`${authHost}/auth/validate/${id}`, {
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
    return data; // { isSuccess: true, result: 'send success' }
  } catch (error) {
    console.error('fail validate: ' + error);
    return { isSuccess: false, result: 'fail validate' };
  }
};

export { userCreate, userUpdate, userDelete, userValidate };