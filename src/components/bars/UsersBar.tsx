import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { userCurrentList, userList } from "@/src/libs/user";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconDown from "@/public/images/icons/arrow-down.svg";
import UserItem from "@/src/components/items/UserItem";

export default function UsersBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const handleRequestFail = useHandleRequestFail();

  const toggleIsOpen = useCallback(() => setIsOpen(prevIsOpen => !prevIsOpen), []);

  const fetchUsers = useCallback(async (fetchFunc: () => Promise<any>, setFunc: Dispatch<SetStateAction<User[]>>) => {
    try {
      const data = await fetchFunc();
      if (!data.isSuccess) throw new Error(handleRequestFail(data));
      
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

  return (
    <div className="flex flex-col justify-center pb-4 w-full md:w-160 lg:w-80 lg:h-[calc(100%-1rem)] lg:mb-4 bg-white rounded-xl">
      <div className={clsx("md:hidden justify-center items-center pt-4", {
        "hidden": isOpen,
        "flex": !isOpen })}>
        <button
          type="button"
          onClick={toggleIsOpen}>
          <IconDown width={16} height={16} />
        </button>
      </div>
      <div className={clsx("hidden lg:hidden justify-center items-center gap-4 pt-4", {
        "hidden": isOpen,
        "md:flex": !isOpen })}>
        <h3 className="text-xl text-center font-semibold">접속 중 ({currentUsers.length}명)</h3>
        <button
          type="button"
          onClick={toggleIsOpen}>
          <IconDown width={16} height={16} />
        </button>
      </div>
      <div className={clsx("lg:hidden justify-center items-center pt-4", {
        "flex": isOpen,
        "hidden": !isOpen })}>
        <button
          type="button"
          onClick={toggleIsOpen}
          className="rotate-180">
          <IconDown width={16} height={16} />
        </button>
      </div>
      <div className="hidden lg:flex justify-center items-center pt-4">
        <h3 className="text-xl text-center font-semibold">접속 중 ({currentUsers.length}명)</h3>
      </div>
      <div className={clsx("lg:flex flex-col pt-4 size-full space-y-4 overflow-y-auto", {
        "flex": isOpen,
        "hidden": !isOpen })}>
        {users.sort((a, b) => {
          if (!a.lastLoginDate) return 1;
          if (!b.lastLoginDate) return -1;
          return b.lastLoginDate.getTime() - a.lastLoginDate.getTime();
        }).map((user) => {
          const isCurrent = currentUsers.some((currentUser) => currentUser.idx === user.idx);
          return <UserItem key={`${user.idx}`} user={user} isCurrent={isCurrent} />;
        })}
      </div>
    </div>
  );
}