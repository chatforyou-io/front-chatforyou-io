"use server";

import { AxiosError } from "axios";
import instance from "@/src/libs/utils/instance";
import { handleAxiosError } from "@/src/libs/utils/serverCommon";

const userCreate = async (user: User) => {
  try {
    if (!user.pwd || !user.confirmPwd) throw new AxiosError("비밀번호를 입력해주세요.");

    const { data } = await instance.post("/chatforyouio/user/create", { ...user, pwd: btoa(user.pwd), confirmPwd: btoa(user.confirmPwd) });

    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const userUpdate = async (idx: number, nickName: string) => {
  try {
    const { data } = await instance.patch("/chatforyouio/user/update", { idx, nickName });
    
    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const userDelete = async (idx: number) => {
  try {
    const { data } = await instance.delete("/chatforyouio/user/delete", { data: { userIdx: idx } });
    
    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const userInfo = async (id: string, pwd: string) => {
  try {
    const { data } = await instance.get(`/chatforyouio/user/info`, { params: { id, pwd: btoa(pwd) } });
    
    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const userCheckNickname = async (nickname: string) => {
  try {
    const { data } = await instance.get("/chatforyouio/user/check_nick_name", { params: { nickName: nickname } });
    
    return { isSuccess: true, ...data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

const userList = async () => {
  try {
    const response = await instance.get("/chatforyouio/user/list");
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
}

const userCurrentList = async () => {
  try {
    const response = await instance.get("/chatforyouio/user/list/current");
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
}

export { userCreate, userUpdate, userDelete, userInfo, userCheckNickname, userList, userCurrentList };