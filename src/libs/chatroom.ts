"use server";

import { AxiosError } from "axios";
import serverApi from "@/src/libs/utils/serverApi";

const chatroomCreate = async (chatroom: Chatroom) => {
  try {
    if (chatroom.usePwd && !chatroom.pwd) throw new AxiosError("비밀번호를 입력해주세요.");

    const { data } = await serverApi.post("/chatforyouio/chatroom/create", chatroom.usePwd ? { ...chatroom, pwd: chatroom.pwd } : chatroom);
    
    return { isSuccess: true,  ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

const chatroomList = async (keyword: string, pageNum: number, pageSize: number) => {
  if (pageNum < 1 || pageSize < 1) {
    return { isSuccess: false, message: "페이지 번호와 페이지 크기는 1 이상이어야 합니다." };
  }
  
  try {
    const { data } = await serverApi.get("/chatforyouio/chatroom/list", {
      params: { keyword, pageNum, pageSize }
    });
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

const chatroomInfo = async (sessionId: string) => {
  try {
    const { data } = await serverApi.get(`/chatforyouio/chatroom/info/${sessionId}`);
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

const chatroomToken = async (sessionId: string, userIdx: number) => {
  try {
    const { data } = await serverApi.get(`/chatforyouio/chatroom/join/${sessionId}`, { params: { user_idx: userIdx } });

    const { result, joinData } = data;
    if (result !== "success") throw new AxiosError("토큰을 가져오는데 실패했습니다.");

    return { isSuccess: true, ...joinData };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

export { chatroomCreate, chatroomList, chatroomInfo, chatroomToken };