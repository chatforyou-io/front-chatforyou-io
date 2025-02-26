"use server";

import { AxiosError } from "axios";
import apiClient from "@/src/libs/utils/apiClient";
import { handleAxiosError } from "@/src/libs/utils/serverCommon";

const chatroomCreate = async (chatroom: Chatroom) => {
  try {
    if (chatroom.usePwd && !chatroom.pwd) throw new AxiosError("비밀번호를 입력해주세요.");

    const { data } = await apiClient.post("/chatforyouio/chatroom/create", chatroom.usePwd ? { ...chatroom, pwd: chatroom.pwd } : chatroom);
    
    return { isSuccess: true,  ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const chatroomList = async () => {
  try {
    const { data } = await apiClient.get("/chatforyouio/chatroom/list");
    
    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const chatroomInfo = async (sessionId: string) => {
  try {
    const { data } = await apiClient.get(`/chatforyouio/chatroom/info/${sessionId}`);
    
    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const chatroomToken = async (sessionId: string, userIdx: number) => {
  try {
    const { data } = await apiClient.get(`/chatforyouio/chatroom/join/${sessionId}`, { params: { user_idx: userIdx } });

    const { result, joinData } = data;
    if (result !== "success") throw new AxiosError("토큰을 가져오는데 실패했습니다.");

    return { isSuccess: true, ...joinData };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
}

export { chatroomCreate, chatroomList, chatroomInfo, chatroomToken };