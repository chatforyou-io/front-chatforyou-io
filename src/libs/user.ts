"use server";

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ":" + authPassword);

const userCreate = async (user: User) => {
  try {
    if (!user.pwd || !user.confirmPwd) {
      throw new Error("비밀번호를 입력해주세요.");
    }

    user.pwd = btoa(user.pwd);
    user.confirmPwd = btoa(user.confirmPwd);

    const data = await fetch(`${authHost}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("서버와의 통신 중 오류가 발생했습니다.");
      }
      return response.json();
    });

    /*
      {
        result: "success",
        userData: {
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
    return { isSuccess: false, result: "fail create", error: error };
  }
};

const userUpdate = async (user: User) => {
  try {
    const data = await fetch(`${authHost}/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("서버와의 통신 중 오류가 발생했습니다.");
      }
      return response.json();
    });

    /*
      {
        result: "success",
        userData: {
          idx: number,
          id: string,
          name: string,
          nickName: string
        }
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    return { isSuccess: false, result: "fail update", error: error };
  }
};

const userDelete = async (id: string, pwd: string) => {
  try {
    const data = await fetch(`${authHost}/user/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
      body: JSON.stringify({ id, pwd: btoa(pwd) }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("서버와의 통신 중 오류가 발생했습니다.");
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
    return { isSuccess: false, result: "fail delete user", error: error };
  }
};

const userLogin = async (id: string, pwd: string) => {
  try {
    const data = await fetch(`${authHost}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
      body: JSON.stringify({ id, pwd: btoa(pwd) }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: 서버와의 통신 중 오류가 발생했습니다.`);
      }
      // 응답 헤더에서 필요한 정보 추출
      const headers: { [key: string]: string } = {};
      response.headers.forEach((value, name) => {
        if (name === "accesstoken" || name === "refreshtoken") {
          headers[name] = value;
        }
      });

      return response
        .json()
        .then(data => {
          data.userData.accesstoken = headers.accesstoken;
          data.userData.refreshtoken = headers.refreshtoken;
          return data;
        });
    });

    /*
      {
        result: "success",
        userData: {
          idx: number,
          id: string,
          name: string,
          nickName: string
        }
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    return { isSuccess: false, result: "fail info", error: error };
  }
};

const userInfo = async (id: string, pwd: string) => {
  try {
    const querysting = new URLSearchParams({ id, pwd: btoa(pwd) }).toString();
    const data = await fetch(`${authHost}/user/info?${querysting}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("서버와의 통신 중 오류가 발생했습니다.");
      }
      return response.json();
    });

    /*
      {
        result: "success",
        userData: {
          idx: number,
          id: string,
          name: string,
          nickName: string
        }
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    return { isSuccess: false, result: "fail info", error: error };
  }
};

const userCheckNickname = async (nickname: string) => {
  try {
    const data = await fetch(`${authHost}/user/check_nick_name?nickName=${nickname}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("서버와의 통신 중 오류가 발생했습니다.");
      }
      return response.json();
    });

    /*
      {
        result: "success",
        isDuplicate: boolean
      }
    */
    data.isSuccess = true;
    return data;
  } catch (error) {
    return { isSuccess: false, result: "fail check nickname", error: error };
  }
};

const userValidate = async (email: string) => {
  try {
    const apiResponse = await fetch(`${authHost}/auth/validate?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
    });
  
    if (!apiResponse.ok) {
      throw new Error("서버와의 통신 중 오류가 발생했습니다.");
    }

    const data = await apiResponse.json();

    let mailCode = "";
    const setCookieHeader = apiResponse.headers.get("set-Cookie");
    if (setCookieHeader) {
      // 쿠키 문자열을 파싱하여 "mailCode" 키의 값을 찾습니다.
      const cookies = setCookieHeader.split(";").map(cookie => cookie.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith("mailCode=")) {
          mailCode = cookie.split("=")[1];
          break;
        }
      }
    }

    /*
      {
        result: "send success"
      }
    */
    return {
      isSuccess: true,
      result: data.result,
      mailCode: mailCode,
    };
  } catch (error) {
    return { isSuccess: false, result: "fail validate", error: error };
  }
};

export { userCreate, userUpdate, userDelete, userLogin, userInfo, userCheckNickname, userValidate };