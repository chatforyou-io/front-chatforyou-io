"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { usePathname } from 'next/navigation';
interface SessionContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<{ isSuccess: boolean, message: string }>;
  signOut: () => Promise<{ isSuccess: boolean, message: string }>;
  updateUser: (idx: number, nickName: string) => Promise<{ isSuccess: boolean, message: string }>;
  deleteUser: (idx: number) => Promise<{ isSuccess: boolean, message: string }>;
}

interface SessionResultType {
  isSuccess: boolean;
  message: string;
  session?: User;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * 사용자 컨텍스트
 * @param {ReactNode} children 자식 요소
 * @returns {ReactNode} 사용자 컨텍스트
 */
export function SessionProvider({ children }: { children: ReactNode }): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  /**
   * 로그인
   * @param {string} username 사용자 이름
   * @param {string} password 사용자 비밀번호
   * @returns {Promise<SessionResultType>} 로그인 결과
   */
  const signIn = useCallback(async (username: string, password: string): Promise<SessionResultType> => {
    try {
      // 로그인 요청
      const { status, data } = await axios.post("/chatforyouio/front/api/signin", { username, password });
      const { userData, message } = data;

      // 로그인 실패 시
      if (status !== 200) {
        throw new AxiosError(message || "알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해주세요.");
      }

      // 로그인 성공 시
      setUser(userData);

      // 로그인 성공 시
      return { isSuccess: true, message: "로그인에 성공했습니다." };
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data.message : "알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해주세요.";
      return { isSuccess: false, message: errorMessage };
    }
  }, []);

  /**
   * 로그아웃
   */
  const signOut = useCallback(async (): Promise<SessionResultType> => {
    try {
      // 사용자 정보 초기화
      setUser(null);

      // 로그아웃 요청
      const { status, data } = await axios.get("/chatforyouio/front/api/signout");
      const { message } = data;

      // 로그아웃 실패 시
      if (status !== 200) {
        throw new AxiosError(message || "알 수 없는 오류로 로그아웃에 실패했습니다. 다시 시도해주세요.");
      }

      // 로그아웃 성공 시
      return { isSuccess: true, message: "로그아웃에 성공했습니다." };
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data.message : "알 수 없는 오류로 로그아웃에 실패했습니다. 다시 시도해주세요.";
      return { isSuccess: false, message: errorMessage };
    }
  }, []);

  /**
   * 사용자 정보 가져오기
   * @returns {Promise<SessionResultType>} 사용자 정보
   */
  const getUser = useCallback(async (): Promise<SessionResultType> => {
    if (user) {
      return { isSuccess: true, message: "사용자 정보 조회에 성공했습니다.", session: user };
    }

    try {
      const { status, data } = await axios.get("/chatforyouio/front/api/me");
      const { session, message } = data;

      if (status !== 200) {
        throw new AxiosError(message || "알 수 없는 오류로 사용자 정보를 가져오지 못했습니다. 다시 시도해주세요.");
      }

      setUser(session);

      return { isSuccess: true, message: "사용자 정보 조회에 성공했습니다.", session };
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data.message : "알 수 없는 오류로 사용자 정보를 가져오지 못했습니다. 다시 시도해주세요.";
      return { isSuccess: false, message: errorMessage };
    }
  }, [user]);

  /**
   * 사용자 정보 수정
   * @param {number} idx 사용자 인덱스
   * @param {string} nickName 사용자 닉네임
   * @returns {Promise<SessionResultType>} 사용자 정보 수정 결과
   */
  const updateUser = useCallback(async (idx: number, nickName: string): Promise<SessionResultType> => {
    try {
      const { status, data } = await axios.patch("/chatforyouio/front/api/me", { idx, nickName });
      const { message } = data;

      if (status !== 200) {
        throw new AxiosError(message || "알 수 없는 오류로 사용자 정보를 수정하지 못했습니다. 다시 시도해주세요.");
      }

      return { isSuccess: true, message: "사용자 정보를 수정하였습니다." };
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data.message : "알 수 없는 오류로 사용자 정보를 수정하지 못했습니다. 다시 시도해주세요.";
      return { isSuccess: false, message: errorMessage };
    }
  }, []);

  /**
   * 사용자 정보 삭제
   * @param {number} idx 사용자 인덱스
   * @returns {Promise<SessionResultType>} 사용자 정보 삭제 결과
   */
  const deleteUser = useCallback(async (idx: number): Promise<SessionResultType> => {
    try {
      const { status, data } = await axios.delete("/chatforyouio/front/api/me", { data: { idx } });
      const { message } = data;

      if (status !== 200) { 
        throw new AxiosError(message || "알 수 없는 오류로 사용자 정보를 삭제하지 못했습니다. 다시 시도해주세요.");
      }

      return { isSuccess: true, message: "사용자 정보를 삭제하였습니다." };
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data.message : "알 수 없는 오류로 사용자 정보를 삭제하지 못했습니다. 다시 시도해주세요.";
      return { isSuccess: false, message: errorMessage };
    }
  }, []);

  /**
   * 사용자 정보 가져오기
   */
  useEffect(() => {
    // 인증 페이지일 경우 실행하지 않음
    if (pathname.startsWith("/auth/")) {
      return;
    }

    // 사용자 정보가 있을 경우 실행하지 않음
    if (user) {
      return;
    }

    // 사용자 정보 가져오기
    const fetchUser = async () => {
      const { isSuccess, session } = await getUser();

      if (isSuccess && session) {
        setUser(session);
      }
    };
    fetchUser();
  }, [getUser, pathname, user]);

  return (
    <SessionContext.Provider value={{ user, signIn, signOut, updateUser, deleteUser }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * 사용자 컨텍스트 사용
 * @returns {SessionContextType} 사용자 컨텍스트
 */
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new AxiosError('useSession must be used within a SessionProvider');
  }
  return context;
}