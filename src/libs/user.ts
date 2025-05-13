"use server";

import { AxiosError } from "axios";
import serverApiInstance from "@/src/libs/utils/serverApiInstance";

// 사용자 응답 타입
interface UserResponse {
  isSuccess: boolean,
  message?: string
  result?: string,
  userData?: User,
  userList?: User[],
}

/**
 * 사용자 생성
 * @param {User} user 사용자 정보
 * @returns {Promise<UserResponse>} 사용자 정보
 */
const userCreate = async (user: User): Promise<UserResponse> => {
  try {
    if (!user.pwd || !user.confirmPwd) {
      throw new AxiosError("비밀번호를 입력해주세요.");
    }

    const { data } = await serverApiInstance.post("/chatforyouio/user/create", { ...user, pwd: btoa(user.pwd), confirmPwd: btoa(user.confirmPwd) });

    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

/**
 * 사용자 수정
 * @param {number} idx 사용자 인덱스
 * @param {string} nickName 닉네임
 * @returns {Promise<UserResponse>} 사용자 정보
 */
const userUpdate = async (idx: number, nickName: string): Promise<UserResponse> => {
  try {
    const { data } = await serverApiInstance.patch("/chatforyouio/user/update", { idx, nickName });
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

/**
 * 사용자 삭제
 * @param {number} idx 사용자 인덱스
 * @returns {Promise<UserResponse>} 사용자 정보
 */
const userDelete = async (idx: number): Promise<UserResponse> => {
  try {
    const { data } = await serverApiInstance.delete("/chatforyouio/user/delete", { data: { idx } });
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

/**
 * 사용자 정보 조회
 * @param {string} id 아이디
 * @param {string} pwd 비밀번호
 * @returns {Promise<UserResponse>} 사용자 정보
 */
const userInfo = async (id: string, pwd: string): Promise<UserResponse> => {
  try {
    const { data } = await serverApiInstance.get(`/chatforyouio/user/info`, { params: { id, pwd: btoa(pwd) } });
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

/**
 * 사용자 닉네임 중복 체크
 * @param {string} nickname 닉네임
 * @returns {Promise<UserResponse>} 사용자 정보
 */
const userCheckNickname = async (nickname: string): Promise<UserResponse> => {
  try {
    const { data } = await serverApiInstance.get("/chatforyouio/user/check_nick_name", { params: { nickName: nickname } });
    
    return { isSuccess: true, ...data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
};

/**
 * 사용자 목록 조회
 * @returns {Promise<UserResponse>} 사용자 정보
 */
const userList = async (): Promise<UserResponse> => {
  try {
    const response = await serverApiInstance.get("/chatforyouio/user/list");
    
    return { isSuccess: true, ...response.data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

/**
 * 현재 사용자 목록 조회
 * @returns {Promise<UserResponse>} 사용자 정보
 */ 
const userCurrentList = async (): Promise<UserResponse> => {
  try {
    const response = await serverApiInstance.get("/chatforyouio/user/list/current");
    
    return { isSuccess: true, ...response.data };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

export { userCreate, userUpdate, userDelete, userInfo, userCheckNickname, userList, userCurrentList };