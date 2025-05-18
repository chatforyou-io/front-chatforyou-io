"use server";

import { AxiosError } from "axios";
import serverApi from "@/src/libs/utils/serverApi";

// 로그인 응답 타입
interface SignInResponse {
  isSuccess: boolean;
  message?: string;
  userData?: User;
  accessToken?: string;
  refreshToken?: string;
}

// 로그아웃 응답 타입
interface SignOutResponse {
  isSuccess: boolean;
  message?: string;
}

// 이메일 유효성 검사 응답 타입
interface ValidateResponse {
  isSuccess: boolean;
  message?: string;
  result?: string;
  mailCode?: string;
}

/**
 * 로그인
 * @param {string} id 아이디
 * @param {string} pwd 비밀번호
 * @returns {Promise<SignInResponse>} 사용자 정보, 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */
async function signIn(id: string, pwd: string): Promise<SignInResponse> {
  try {
    const { headers, data } = await serverApi.post("/chatforyouio/auth/login", { id, pwd: btoa(pwd) });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];

    if (!accessToken || !refreshToken) {
      throw new AxiosError("토큰을 가져오는데 실패했습니다.");
    }

    return {
      isSuccess: true,
      userData: data.userData,
      accessToken,
      refreshToken
    };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

/**
 * 소셜 로그인
 * @param {string} provider 소셜 플랫폼 이름
 * @param {string} providerAccountId 소셜 플랫폼 계정 ID
 * @param {string} id 아이디
 * @param {string} name 이름
 * @param {string} nickName 닉네임
 * @returns {Promise<SignInResponse>} 사용자 정보, 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */ 
async function socialSignIn(provider: string, providerAccountId: string, id?: string, name?: string, nickName?: string): Promise<SignInResponse> {
  try {
    const { headers, data } = await serverApi.post("/chatforyouio/auth/login/social", { provider, providerAccountId, id, name, nickName });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];

    if (!accessToken || !refreshToken) {
      throw new AxiosError("토큰을 가져오는데 실패했습니다.");
    }

    return {
      isSuccess: true,
      userData: data.userData,
      accessToken,
      refreshToken
    };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

/**
 * 로그아웃
 * @returns {Promise<SignOutResponse>} 로그아웃 성공 여부 또는 에러 응답
 */
async function signOut(idx: number, id: string): Promise<SignOutResponse> {
  try {
    await serverApi.post("/chatforyouio/auth/logout", { idx, id });

    return {
      isSuccess: true,
    };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

/**
 * 이메일 유효성 검사
 * @param {string} email 이메일
 * @returns {Promise<ValidateResponse>} 이메일 유효성 검사 결과 또는 에러 응답
 */
async function validate(email: string): Promise<ValidateResponse> {
  try {
    const { headers, data } = await serverApi.get("/chatforyouio/auth/validate", { params: { email } });

    const cookies = headers["set-cookie"];

    if (!cookies) {
      throw new AxiosError("메일코드를 가져오는데 실패했습니다.");
    }

    const mailCodeCookie = cookies.find((cookie: string) => cookie.startsWith("mailCode="));
    const mailCode = mailCodeCookie ? mailCodeCookie.split("=")[1].split(";")[0] : '';

    if (!mailCode) {
      throw new AxiosError("메일코드를 가져오는데 실패했습니다.");
    }
    
    return {
      isSuccess: true,
      result: data.result,
      mailCode
    };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

/**
 * 토큰 갱신
 * @returns {Promise<SignInResponse>} 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */
async function refreshToken(idx: number, id: string): Promise<SignInResponse> {
  try {
    const { headers } = await serverApi.post("/chatforyouio/auth/refresh_token", { idx, id });

    const accessToken = headers["accesstoken"];
    const refreshToken = headers["refreshtoken"];
    
    if (!accessToken || !refreshToken) {
      throw new AxiosError("토큰을 가져오는데 실패했습니다.");
    }

    return {
      isSuccess: true,
      accessToken,
      refreshToken
    };
  } catch (error: any) {
    return { isSuccess: false, message: error.message };
  }
}

export { signIn, socialSignIn, signOut, validate, refreshToken };