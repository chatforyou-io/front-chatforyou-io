"use server";

import { AxiosError } from "axios";
import instance from "@/src/libs/utils/instance";
import { handleAxiosError } from "@/src/libs/utils/serverCommon";

const login = async (id: string, pwd: string) => {
  try {
    const { headers, data } = await instance.post("/chatforyouio/auth/login", { id, pwd: btoa(pwd) });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];

    if (!accessToken || !refreshToken) throw new AxiosError("토큰을 가져오는데 실패했습니다.");

    return {
      isSuccess: true,
      ...data,
      userData: {
        ...data.userData,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const socialLogin = async (provider: string, providerAccountId: string, id?: string, name?: string, nickName?: string) => {
  try {
    const { headers, data } = await instance.post("/chatforyouio/auth/login/social", { provider, providerAccountId, id, name, nickName });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];

    return {
      isSuccess: true,
      ...data,
      userData: {
        ...data.userData,
        accessToken,
        refreshToken
      }
    };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const validate = async (email: string) => {
  try {
    const { headers, data } = await instance.get("/chatforyouio/auth/validate", { params: { email }, withCredentials: true });

    const cookies = headers['set-cookie'];
    if (!cookies) throw new AxiosError("메일코드를 가져오는데 실패했습니다.");

    const mailCodeCookie = cookies.find(cookie => cookie.startsWith('mailCode='));
    const mailCode = mailCodeCookie ? mailCodeCookie.split('=')[1].split(';')[0] : '';
    
    return { isSuccess: true, result: data.result, mailCode };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

export { login, socialLogin, validate };