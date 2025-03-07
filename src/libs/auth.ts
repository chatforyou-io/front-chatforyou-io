"use server";

import { AxiosError } from "axios";
import { handleAxiosError } from "@/src/libs/utils/serverCommon";
import serverApiInstance from "@/src/libs/utils/serverApiInstance";

// 로그인 응답 타입
interface SignInResponse extends DefaultResponse {
  userData?: UserData;
  accessToken?: string;
  refreshToken?: string;
}

// 로그아웃 응답 타입
interface SignOutResponse extends DefaultResponse {
  isSuccess: boolean;
}

// 이메일 유효성 검사 응답 타입
interface ValidateResponse extends DefaultResponse {
  result?: boolean;
  mailCode?: string;
}

/**
 * 로그인
 * @param {string} id 아이디
 * @param {string} pwd 비밀번호
 * @returns {Promise<SignInResponse>} 사용자 정보, 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */
const signIn = async (id: string, pwd: string): Promise<SignInResponse> => {
  try {
    const { headers, data } = await serverApiInstance.post("/chatforyouio/auth/login", { id, pwd: btoa(pwd) });

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
 * @returns {Promise<SignInResponse>} 사용자 정보, 액세스 토큰, 리프레시 토큰 또는 에러 응답
 */ 
const socialSignIn = async (provider: string, providerAccountId: string, id?: string, name?: string, nickName?: string): Promise<SignInResponse> => {
  try {
    const { headers, data } = await serverApiInstance.post("/chatforyouio/auth/login/social", { provider, providerAccountId, id, name, nickName });

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
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

/**
 * 로그아웃
 * @returns {Promise<SignOutResponse>} 로그아웃 성공 여부 또는 에러 응답
 */
const logout = async (): Promise<SignOutResponse> => {
  try {
    await serverApiInstance.post("/chatforyouio/auth/logout");

    return {
      isSuccess: true,
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
    const { headers, data } = await serverApiInstance.get("/chatforyouio/auth/validate", { params: { email } });

    const cookies = headers["Set-Cookie"];

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
  } catch (error) {
    return handleAxiosError(error as AxiosError);
  }
};

export { signIn, socialSignIn, logout, validate };