"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';

interface SessionContextType {
  user: User | null;
  signIn: (username: string, password: string) => Promise<{ isSuccess: boolean, message: string }>;
  signOut: () => Promise<{ isSuccess: boolean, message: string }>;
  updateUser: (idx: number, nickName: string) => Promise<{ isSuccess: boolean, message: string }>;
  deleteUser: (idx: number) => Promise<{ isSuccess: boolean, message: string }>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * 사용자 컨텍스트
 * @param {ReactNode} children 자식 요소
 * @returns {ReactNode} 사용자 컨텍스트
 */
export function SessionProvider({ children }: { children: ReactNode }): ReactNode {
  const [user, setUser] = useState<User | null>(null);

  /**
   * 로그인
   * @param {string} username 사용자 이름
   * @param {string} password 사용자 비밀번호
   * @returns {Promise<{ isSuccess: boolean, message: string }>} 로그인 결과
   */
  const signIn = useCallback(async (username: string, password: string): Promise<{ isSuccess: boolean, message: string }> => {
    try {
      // 로그인 요청
      const { status, data } = await axios.post("/chatforyouio/front/api/signIn", { username, password });
      const { userData, message } = data;

      // 로그인 실패 시
      if (status !== 200) {
        throw new Error(message || "알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해주세요.");
      }

      // 로그인 성공 시
      setUser(userData);

      // 로그인 성공 시
      return { isSuccess: true, message: "로그인에 성공했습니다." };
    } catch (error) {
      console.error(error);
      return { isSuccess: false, message: "로그인에 실패했습니다. 다시 시도해주세요." };
    }
  }, []);

  /**
   * 로그아웃
   */
  const signOut = useCallback(async (): Promise<{ isSuccess: boolean, message: string }> => {
    try {
      // 로그아웃 요청
      const { status, data } = await axios.post("/chatforyouio/front/api/signOut");
      const { message } = data;

      // 로그아웃 실패 시
      if (status !== 200) {
        throw new Error(message || "알 수 없는 오류로 로그아웃에 실패했습니다. 다시 시도해주세요.");
      }

      // 로그아웃 성공 시
      setUser(null);

      // 로그아웃 성공 시
      return { isSuccess: true, message: "로그아웃에 성공했습니다." };
    } catch (error) {
      console.error(error);
      return { isSuccess: false, message: "로그아웃에 실패했습니다. 다시 시도해주세요." };
    }
  }, []);

  const getUser = useCallback(async (): Promise<User | null> => {
    try {
      const { status, data } = await axios.get("/chatforyouio/front/api/user");
      const { userData, message } = data;

      if (status !== 200) {
        throw new Error(message || "알 수 없는 오류로 사용자 정보를 가져오지 못했습니다. 다시 시도해주세요.");
      }

      setUser(userData);

      return userData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const updateUser = useCallback(async (idx: number, nickName: string): Promise<{ isSuccess: boolean, message: string }> => {
    try {
      const { status, data } = await axios.put("/chatforyouio/front/api/user", { idx, nickName });
      const { message } = data;

      if (status !== 200) {
        throw new Error(message || "알 수 없는 오류로 사용자 정보를 수정하지 못했습니다. 다시 시도해주세요.");
      }

      return { isSuccess: true, message: "사용자 정보를 수정하였습니다." };
    } catch (error) {
      console.error(error);
      return { isSuccess: false, message: "사용자 정보를 수정하지 못했습니다. 다시 시도해주세요." };
    }
  }, []);

  const deleteUser = useCallback(async (idx: number): Promise<{ isSuccess: boolean, message: string }> => {
    try {
      const { status, data } = await axios.delete("/chatforyouio/front/api/user", { params: { idx } });
      const { message } = data;

      if (status !== 200) { 
        throw new Error(message || "알 수 없는 오류로 사용자 정보를 삭제하지 못했습니다. 다시 시도해주세요.");
      }

      return { isSuccess: true, message: "사용자 정보를 삭제하였습니다." };
    } catch (error) {
      console.error(error); 
      return { isSuccess: false, message: "사용자 정보를 삭제하지 못했습니다. 다시 시도해주세요." };
    }
  }, []);

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
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}