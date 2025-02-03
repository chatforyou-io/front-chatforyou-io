import { FC, useCallback, useEffect, useState } from "react";
import { userCurrentList, userList } from "@/src/libs/user";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconUser from '@/public/images/icon-user.svg';

interface DashboardSidebarProps {
}

const DashboardSidebar: FC<DashboardSidebarProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const handleRequestFail = useHandleRequestFail();

  const fetchUsers = useCallback(async () => {
    try {
      const data = await userList();
      if (!data.isSuccess) {
        const message = handleRequestFail(data);
        throw new Error(message);
      }
      
      const newUsers = [ ...(data.userList || []) ];
      setUsers(newUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  }, [handleRequestFail]);

  const fetchCurrentUsers = useCallback(async () => {
    try {
      const data = await userCurrentList();
      if (!data.isSuccess) {
        const message = handleRequestFail(data);
        throw new Error(message);
      }
      
      const newCurrentUsers = [ ...(data.userList || []) ];
      setCurrentUsers(newCurrentUsers);
    } catch (error) {
      console.error("Failed to fetch current users:", error);
      setCurrentUsers([]);
    }
  }, [handleRequestFail]);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUsers();
  }, [fetchUsers, fetchCurrentUsers]);

  return (
    <div className="w-full lg:w-72 lg:h-full">
      <div className="lg:p-4 lg:size-full rounded-sm overflow-y-auto">
        <div className="p-4 size-full bg-white">
          <h3 className="text-xl text-center font-semibold">접속 중 ({currentUsers.length}명)</h3>
          <div className="flex flex-col gap-4 py-4 size-full">
            {currentUsers.map((user) => (
              <div key={`currentuser_${user.idx}`} className="flex items-center gap-2 px-4 w-full">
                <IconUser aria-label="room" width={36} height={36} className="border-2 border-gray-700 text-gray-700 fill-gray-700 rounded-full" />
                <span className="text-gray-700">{user.name}</span>
              </div>
            ))}
            {users.filter((user) => !currentUsers.find((current) => current.idx === user.idx)).map((user) => (
              <div key={`user_${user.idx}`} className="flex items-center gap-2 px-4 w-full">
                <IconUser aria-label="room" width={36} height={36} className="border-2 border-gray-400 text-gray-400 fill-gray-400 rounded-full" />
                <span className="text-gray-400">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;