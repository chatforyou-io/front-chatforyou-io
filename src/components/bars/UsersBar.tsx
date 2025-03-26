import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import { userCurrentList, userList } from "@/src/libs/user";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import IconDown from "@/public/images/icons/arrow-down.svg";
import UserItem from "@/src/components/items/UserItem";
import { useSession } from "@/src/contexts/SessionContext";
import { connectUserListSSE } from "@/src/libs/sses/userList";

export default function UsersBar() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const handleRequestFail = useHandleRequestFail();  

  const fetchUsers = useCallback(async () => {
    if (!user?.idx) return;

    try {
      // 유저 목록 조회
      const userData = await userList();
      const currentUserData = await userCurrentList();

      if (!userData.isSuccess || !currentUserData.isSuccess) {
        throw new Error(handleRequestFail(userData));
      }

      setUsers(userData.userList || []);
      setCurrentUsers(currentUserData.userList || []);

      // SSE 연결
      const eventSource = connectUserListSSE(user.idx, {
        onUpdateUserList: (users) => {
          console.log(users);
          setUsers(users.userList || []);
          setCurrentUsers(users.loginUserList || []);
        }
      });
      
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [user?.idx, handleRequestFail]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleIsOpen = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  return (
    <div className="flex flex-col justify-center pb-4 w-full md:w-160 lg:w-80 lg:h-[calc(100%-1rem)] lg:mb-4 bg-white rounded-xl">
      {/* 모바일 버전 토글 버튼 */}
      <div className={clsx("md:hidden justify-center items-center pt-4", {
        "hidden": isOpen,
        "flex": !isOpen })}>
        <button
          type="button"
          onClick={toggleIsOpen}>
          <IconDown width={16} height={16} />
        </button>
      </div>

      {/* 데스크톱 버전 토글 버튼 */}
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

      {/* 데스크톱 버전 인원 목록 */}
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

      {/* 데스크톱 버전 인원 목록 */}
      <div className="hidden lg:flex justify-center items-center pt-4">
        <h3 className="text-xl text-center font-semibold">접속 중 ({currentUsers.length}명)</h3>
      </div>

      {/* 데스크톱 버전 인원 목록 */}
      <div className={clsx("lg:flex flex-col pt-4 size-full space-y-4 overflow-y-auto", {
        "flex": isOpen,
        "hidden": !isOpen })}>
        {users.sort((a, b) => {
          if (!a.lastLoginDate) return 1;
          if (!b.lastLoginDate) return -1;
          return b.lastLoginDate - a.lastLoginDate;
        }).map((user) => {
          const isCurrent = currentUsers.some((currentUser) => currentUser.idx === user.idx);
          return <UserItem key={`${user.idx}`} user={user} isCurrent={isCurrent} />;
        })}
      </div>
    </div>
  );
}