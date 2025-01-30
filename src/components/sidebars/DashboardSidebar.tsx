import { FC, useCallback, useEffect, useState } from 'react';
import CustomImage from '../CustomImage';
import { userCurrentList, userList } from '@/src/libs/user';
import userMocks from '@/src/mocks/users.json';

interface DashboardSidebarProps {
}

const DashboardSidebar: FC<DashboardSidebarProps> = () => {
  const [users, setUsers] = useState<User[]>(userMocks);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await userList();
      setUsers([ ...userMocks, ...(data.userList || []) ]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  }, []);

  const fetchCurrentUsers = useCallback(async () => {
    try {
      const data = await userCurrentList();
      setCurrentUsers(data.userList || []);
    } catch (error) {
      console.error("Failed to fetch current users:", error);
      setCurrentUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUsers();
  }, [fetchUsers, fetchCurrentUsers]);

  return (
    <div className="py-8 w-72 h-full bg-white rounded overflow-y-auto">
      <h3 className="text-xl text-center font-semibold">접속 중 ({currentUsers.length}명)</h3>
      <div className="flex flex-col gap-4 py-8 size-full">
        {currentUsers.map((user) => (
          <div key={user.idx} className="flex items-center gap-2 px-4 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={36} height={36} className="border-2 border-gray-700 text-gray-700 rounded-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" fill="currentColor" />
            </svg>
            <span className="text-gray-700">{user.name}</span>
          </div>
        ))}
        {users.filter((user) => !currentUsers.find((current) => current.idx === user.idx)).map((user) => (
          <div key={user.idx} className="flex items-center gap-2 px-4 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={36} height={36} className="border-2 border-gray-400 text-gray-400 rounded-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" fill="currentColor" />
            </svg>
            <span className="text-gray-400">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;