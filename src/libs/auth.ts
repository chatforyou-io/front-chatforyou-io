"use server";

import { AxiosError } from "axios";
import apiClient from "@/src/libs/utils/apiClient";
import { handleAxiosError } from "@/src/libs/utils/serverCommon";

/**
 * 로그인
 * @param {string} id 아이디
 * @param {string} pwd 비밀번호
 * @returns {Promise<LoginResponse>} 사용자 정보, 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */
const login = async (id: string, pwd: string): Promise<LoginResponse> => {
  try {
    const { headers, data } = await apiClient.post("/chatforyouio/auth/login", { id, pwd: btoa(pwd) });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];

    if (!accessToken || !refreshToken) {
      throw new AxiosError("토큰을 가져오는데 실패했습니다.");
    }

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

/**
 * 소셜 로그인
 * @param {string} provider 소셜 플랫폼 이름
 * @param {string} providerAccountId 소셜 플랫폼 계정 ID
 * @param {string} id 아이디
 * @param {string} name 이름
 * @param {string} nickName 닉네임
 * @returns {Promise<LoginResponse>} 사용자 정보, 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */ 
const socialLogin = async (provider: string, providerAccountId: string, id?: string, name?: string, nickName?: string): Promise<LoginResponse> => {
  try {
    const { headers, data } = await apiClient.post("/chatforyouio/auth/login/social", { provider, providerAccountId, id, name, nickName });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];

    if (!accessToken || !refreshToken) {
      throw new AxiosError("토큰을 가져오는데 실패했습니다.");
    }

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

/**
 * 이메일 유효성 검사
 * @param {string} email 이메일
 * @returns {Promise<ValidateResponse>} 이메일 유효성 검사 결과 또는 에러 응답
 */
const validate = async (email: string): Promise<ValidateResponse> => {
  try {
    const { headers, data } = await apiClient.get("/chatforyouio/auth/validate", { params: { email }, withCredentials: true });

    const cookies = headers["set-cookie"];

    if (!cookies) {
      throw new AxiosError("메일코드를 가져오는데 실패했습니다.");
    }

    const mailCodeCookie = cookies.find(cookie => cookie.startsWith("mailCode="));
    const mailCode = mailCodeCookie ? mailCodeCookie.split("=")[1].split(";")[0] : '';

    if (!mailCode) {
      throw new AxiosError("메일코드를 가져오는데 실패했습니다.");
    }
    
    return {
      isSuccess: true,
      result: data.result,
      mailCode
    };
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

export { login, socialLogin, validate };