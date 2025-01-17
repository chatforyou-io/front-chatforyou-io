"use server";

import axios, { AxiosError } from "axios";
import instance from "./utils/instance";

const userCreate = async (user: User) => {
  try {
    if (!user.pwd || !user.confirmPwd) {
      throw new Error("비밀번호를 입력해주세요.");
    }

    const response = await instance.post("/chatforyouio/user/create", { ...user, pwd: btoa(user.pwd), confirmPwd: btoa(user.confirmPwd) });

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

const userUpdate = async (idx: number, nickName: string) => {
  try {
    const response = await instance.patch("/chatforyouio/user/update", { idx, nickName });
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail update", error: errorMessage };
    }

    return { isSuccess: false, result: "fail update", error: (error as Error).message };
  }
};

const userDelete = async (idx: number) => {
  try {
    const response = await instance.delete("/chatforyouio/user/delete", { data: { userIdx: idx } });
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail delete", error: errorMessage };
    }

    return { isSuccess: false, result: "fail delete", error: (error as Error).message };
  }
};

const userInfo = async (id: string, pwd: string) => {
  try {
    const response = await instance.get(`/chatforyouio/user/info`, { params: { id, pwd: btoa(pwd) } });
    
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

const userCheckNickname = async (nickname: string) => {
  try {
    const response = await instance.get("/chatforyouio/user/check_nick_name", { params: { nickName: nickname } });
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail check nickname", error: errorMessage };
    }

    return { isSuccess: false, result: "fail check nickname", error: (error as Error).message };
  }
};

const userList = async () => {
  try {
    const response = await instance.get("/chatforyouio/user/list");
    
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
}

const userCurrentList = async () => {
  try {
    const response = await instance.get("/chatforyouio/user/list/current");
    
    return { isSuccess: true, ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      const errorMessage = `${statusCode}: 서버와의 통신 중 오류가 발생했습니다.`;
      return { isSuccess: false, result: "fail current list", error: errorMessage };
    }

    return { isSuccess: false, result: "fail current list", error: (error as Error).message };
  }
}

export { userCreate, userUpdate, userDelete, userInfo, userCheckNickname, userList, userCurrentList };