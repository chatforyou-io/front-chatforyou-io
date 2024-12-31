"use server";

import axios, { AxiosError } from "axios";
import instance from "./utils/instance";

const login = async (id: string, pwd: string) => {
  try {
    const response = await instance.post("/chatforyouio/auth/login", { id, pwd: btoa(pwd) });

    const accessToken = response.headers["accesstoken"];
    const refreshToken = response.headers["refreshtoken"];

    return {
      isSuccess: true,
      ...response.data,
      userData: {
        ...response.data.userData,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
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
    const response = await instance.post("/chatforyouio/auth/login/social", { provider, providerAccountId, id, name, nickName });

    const accessToken = response.headers["accesstoken"];
    const refreshToken = response.headers["refreshtoken"];

    return { isSuccess: true, ...response.data, userData: { ...response.data.userData, accessToken, refreshToken } };
  } catch (error) {
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
    const response = await instance.get("/chatforyouio/auth/validate", { params: { email }, withCredentials: true });

    let mailCode = "";
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      const mailCodeCookie = cookies.find(cookie => cookie.startsWith('mailCode='));
      if (mailCodeCookie) {
        mailCode = mailCodeCookie.split('=')[1].split(';')[0];
      }
    }
    
    return { isSuccess: true, result: response.data.result, mailCode };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail validate", error: errorMessage };
    }

    return { isSuccess: false, result: "fail validate", error: (error as Error).message };
  }
};

export { login, socialLogin, validate };