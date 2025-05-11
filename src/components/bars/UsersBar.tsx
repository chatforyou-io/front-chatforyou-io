"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { userCurrentList, userList } from "@/src/libs/user";
import IconChevronRight from "@/public/images/icons/chevron-right.svg";
import UserItem from "@/src/components/items/UserItem";
import { useSession } from "@/src/contexts/SessionContext";
import { connectUserListSSE } from "@/src/libs/sses/userList";

export default function UsersBar() {
  const { user } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 유저 목록 조회
  useEffect(() => {
    if (!user?.idx) return;

    const fetchUsers = async () => {
      try {
        // 유저 목록 조회
        const [userData, currentUserData] = await Promise.all([userList(), userCurrentList()]);

        if (!userData.isSuccess || !currentUserData.isSuccess) {
          throw new Error("사용자 목록 조회 실패");
        }

        setUsers(userData.userList || []);
        setCurrentUsers(currentUserData.userList || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [user?.idx]);

  // 유저 목록 조회 SSE 연결
  useEffect(() => {
    if (!user?.idx) return;

    // SSE 연결
    const eventSource = connectUserListSSE(user.idx, {
      onUpdateUserList: (users) => {
        setUsers(users.userList || []);
        setCurrentUsers(users.loginUserList || []);
      }
    });
    
    return () => {
      eventSource.close();
    };
  }, [user?.idx]);

  const sortedUsers = users.sort((a, b) => {
    if (!a.lastLoginDate) return 1;
    if (!b.lastLoginDate) return -1;
    return b.lastLoginDate - a.lastLoginDate;
  });

  console.log(sortedUsers);

  return (
    <>
      <div className={clsx(
        "flex flex-col w-48 h-full overflow-y-auto shadow-xl",
        {
          "hidden md:block": !isOpen,
          "block": isOpen
        }
      )}>
        {sortedUsers.map((user) => {
          const isCurrent = currentUsers.some((currentUser) => currentUser.idx === user.idx);
          return <UserItem key={`${user.idx}`} user={user} isCurrent={isCurrent} />;
        })}
      </div>
      <button
        type="button"
        className={clsx(
          "md:hidden absolute top-1/2 -translate-y-1/2 flex items-center justify-center border border-gray-200 border-l-0 w-12 h-12 bg-white rounded-r-full",
          {
            "left-0 shadow-xl": !isOpen,
            "left-48": isOpen
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconChevronRight className={clsx("w-6 h-6", {
          "rotate-180": isOpen
        })} />
      </button>
    </>
  );
}