import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { userCurrentList, userList } from "@/src/libs/user";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconDown from "@/public/images/icons/arrow-down.svg";
import IconUser from '@/public/images/icon-user.svg';
import clsx from "clsx";

const UserItem = ({ user, isCurrent }: { user: User; isCurrent?: boolean; }) => (
  <div className="flex items-center gap-2 px-4 w-full">
    <IconUser 
      aria-label="user" 
      width={36} 
      height={36} 
      className={clsx("border-2 rounded-full", {
        "border-gray-700 text-gray-700 fill-gray-700": isCurrent,
        "border-gray-400 text-gray-400 fill-gray-400": !isCurrent
      })} 
    />
    <span className={isCurrent ? "text-gray-700" : "text-gray-400"}>{user.name}</span>
  </div>
);

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const handleRequestFail = useHandleRequestFail();

  const toggleIsOpen = useCallback(() => setIsOpen(prevIsOpen => !prevIsOpen), []);

  const fetchUsers = useCallback(async (fetchFunc: () => Promise<any>, setFunc: Dispatch<SetStateAction<User[]>>) => {
    try {
      const data = await fetchFunc();
      if (!data.isSuccess) {
        const message = handleRequestFail(data);
        throw new Error(message);
      }
      
      setFunc(data.userList || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setFunc([]);
    }
  }, [handleRequestFail]);

  useEffect(() => {
    fetchUsers(userList, setUsers);
    fetchUsers(userCurrentList, setCurrentUsers);
  }, [fetchUsers]);

  const currentUserIds = new Set(currentUsers.map(user => user.idx));
  const offlineUsers = users.filter(user => !currentUserIds.has(user.idx));

  return (
    <div className="flex justify-center items-center w-full md:w-160 lg:w-88">
      <div className="flex flex-col justify-center items-center gap-4 py-2 w-full text-center bg-white rounded-xl">
        <div className={clsx("flex flex-col gap-4 lg:flex", { hidden: !isOpen })}>
          <div className="flex justify-center items-center gap-2 pt-2">
            <h3 className="text-xl text-center font-semibold">접속 중 ({currentUsers.length}명)</h3>
            <button
              type="button"
              onClick={toggleIsOpen}
              className={clsx("lg:hidden rotate-180", { hidden: !isOpen})}>
              <IconDown width={24} height={24} />
            </button>
          </div>
          <div className="flex justify-center size-full pt-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mx-auto">
              {currentUsers.map((user) => (<UserItem key={`${user.idx}`} user={user} isCurrent={true} />))}
              {offlineUsers.map((user) => (<UserItem key={`${user.idx}`} user={user} isCurrent={false} />))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleIsOpen}
          className={clsx("lg:hidden", { hidden: isOpen })}>
          <IconDown width={24} height={24} />
        </button>
      </div>
    </div>
  );
}