"use server";

import axios, { AxiosError } from "axios";
import instance from "./utils/instance";

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ":" + authPassword);

const chatroomCreate = async (chatroom: Chatroom) => {
  try {
    if (chatroom.usePwd && !chatroom.pwd) {
      throw new Error("비밀번호를 입력해주세요.");
    }

    if (chatroom.usePwd) {
      chatroom.pwd = btoa(chatroom.pwd!);
    }

    const response = await instance.post("/chatroom/create", chatroom);
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail create", error: errorMessage };
    }

    return { isSuccess: false, result: "fail create", error: (error as Error).message };
  }
};

const chatroomList = async () => {
  try {
    const response = await axios.get(`${authHost}/chatroom/list`, {
      headers: {
        "Authorization": `Basic ${authToken}`,
      },
    });
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail list", error: errorMessage };
    }

    return { isSuccess: false, result: "fail list", error: (error as Error).message };
  }
};

const chatroomInfo = async (sessionId: string) => {
  try {
    const response = await axios.get(`${authHost}/chatroom/info/${sessionId}`, {
      headers: {
        "Authorization": `Basic ${authToken}`,
      },
    });
    
    return { isSuccess: true, ...response.data };
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

const chatroomToken = async (sessionId: string, userIdx: number) => {
  try {
    const response = await axios.get(`${authHost}/chatroom/join/${sessionId}`, {
      params: { user_idx: userIdx },
      headers: {
        "Authorization": `Basic ${authToken}`,
      },
    });

    if (response.data.result !== "success") {
      throw new Error(response.data.error);
    }

    return response.data.joinData.joinUserInfo.camera_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail token", error: errorMessage };
    }

    return { isSuccess: false, result: "fail token", error: (error as Error).message };
  }
}

export { chatroomCreate, chatroomList, chatroomInfo, chatroomToken };