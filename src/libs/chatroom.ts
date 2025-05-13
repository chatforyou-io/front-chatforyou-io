"use server";

import { AxiosError } from "axios";
import serverApiInstance from "@/src/libs/utils/serverApiInstance";

const chatroomCreate = async (chatroom: Chatroom) => {
  try {
    if (chatroom.usePwd && !chatroom.pwd) throw new AxiosError("비밀번호를 입력해주세요.");

    const { data } = await serverApiInstance.post("/chatforyouio/chatroom/create", chatroom.usePwd ? { ...chatroom, pwd: chatroom.pwd } : chatroom);
    
    return { isSuccess: true,  ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

const chatroomList = async () => {
  try {
    const { data } = await serverApiInstance.get("/chatforyouio/chatroom/list");
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

const chatroomInfo = async (sessionId: string) => {
  try {
    const { data } = await serverApiInstance.get(`/chatforyouio/chatroom/info/${sessionId}`);
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

const chatroomToken = async (sessionId: string, userIdx: number) => {
  try {
    const { data } = await serverApiInstance.get(`/chatforyouio/chatroom/join/${sessionId}`, { params: { user_idx: userIdx } });

    const { result, joinData } = data;
    if (result !== "success") throw new AxiosError("토큰을 가져오는데 실패했습니다.");

    return { isSuccess: true, ...joinData };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

export { chatroomCreate, chatroomList, chatroomInfo, chatroomToken };