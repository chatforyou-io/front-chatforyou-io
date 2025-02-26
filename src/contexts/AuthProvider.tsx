import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * 사용자 컨텍스트
 * @param {ReactNode} children 자식 요소
 * @returns {ReactNode} 사용자 컨텍스트
 */
export function UserProvider({ children }: { children: ReactNode }): ReactNode {
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * 사용자 컨텍스트 사용
 * @returns {UserContextType} 사용자 컨텍스트
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}