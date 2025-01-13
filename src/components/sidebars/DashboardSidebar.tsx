import { FC, useCallback, useEffect, useState } from 'react';
import CustomImage from '../CustomImage';
import { userList } from '@/src/libs/user';
import userMocks from '@/src/mocks/users.json';

interface DashboardSidebarProps {
}

const DashboardSidebar: FC<DashboardSidebarProps> = () => {
  const [users, setUsers] = useState<User[]>(userMocks);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await userList();
      setUsers([ ...userMocks, ...(data.userList || []) ]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="py-8 w-72 h-full bg-white rounded overflow-y-auto">
      <h3 className="text-xl text-center font-semibold">접속 중 ({users.length}명)</h3>
      <div className="flex flex-col gap-4 py-8 size-full">
        {users.length === 0 && <p>사용자가 존재하지 않습니다.</p>}
        {users.map((user) => (
          <div key={user.idx} className="flex items-center gap-2 px-4 w-full">
            <CustomImage src="/images/icon-user.svg" alt="room" width={36} height={36} className="border-2 border-gray-700 rounded-full" />
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;