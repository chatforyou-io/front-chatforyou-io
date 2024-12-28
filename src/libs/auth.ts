"use server";

import axios, { AxiosError } from "axios";
import { userDelete } from "./user";

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ":" + authPassword);

const login = async (id: string, pwd: string) => {
  try {
    const response = await axios.post(`${authHost}/auth/login`, { id, pwd: btoa(pwd) }, {
      headers: {
        "Authorization": `Basic ${authToken}`,
      },
    });

    const accesstoken = response.headers["accesstoken"];
    const refreshtoken = response.headers["refreshtoken"];

    return {
      isSuccess: true,
      ...response.data,
      userData: {
        ...response.data.userData,
        accesstoken,
        refreshtoken,
      },
    };
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail info", error: errorMessage };
    }

    return { isSuccess: false, result: "fail info", error: (error as Error).message };
  }
};

const socialLogin = async (provider: string, providerAccountId: string, id?: string, name?: string, nickName?: string) => {
  try {
    const response = await axios.post(`${authHost}/auth/login/social`, { provider, providerAccountId, id, name, nickName }, {
      headers: {
        "Authorization": `Basic ${authToken}`,
      },
    });

    const accesstoken = response.headers["accesstoken"];
    const refreshtoken = response.headers["refreshtoken"];

    return {
      isSuccess: true,
      ...response.data,
      userData: {
        ...response.data.userData,
        accesstoken,
        refreshtoken,
      },
    };
  } catch (error) {
    console.error("소셜 로그인 중 오류 발생:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail info", error: errorMessage };
    }

    return { isSuccess: false, result: "fail info", error: (error as Error).message };
  }
};

const validate = async (email: string) => {
  try {
    const response = await axios.get(`${authHost}/auth/validate`, {
      params: { email },
      headers: {
        "Authorization": `Basic ${authToken}`,
      },
      withCredentials: true,
    });
    const apiResponse = await fetch(`${authHost}/auth/validate?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authToken}`,
      },
    });

    let mailCode = "";
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      const mailCodeCookie = cookies.find(cookie => cookie.startsWith('mailCode='));
      if (mailCodeCookie) {
        mailCode = mailCodeCookie.split('=')[1].split(';')[0];
      }
    }
    
    return {
      isSuccess: true,
      result: response.data.result,
      mailCode: mailCode,
    };
  } catch (error) {
    return { isSuccess: false, result: "fail validate", error: error };
  }
};

export { login, socialLogin, validate };