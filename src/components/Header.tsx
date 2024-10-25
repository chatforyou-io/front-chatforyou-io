"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CustomImage from "@/src/components/CustomImage";
import ProfileCard from "@/src/components/cards/ProfileCard";
import UserUpdateForm from "@/src/components/forms/UserUpdateForm";

export default function Header() {
  const session = useSession();
	const [isProfileActive, setIsProfileActive] = useState<boolean>(false);
  const [isUserUpdateForm, setIsUserUpdateForm] = useState<boolean>(false);
  
  function handleProfile() {
    setIsProfileActive(!isProfileActive);
  }

  return (
    <>
      <div className="absolute top-0 w-full">
        <div className="flex justify-between items-center bg-white px-4 py-2 h-20 text-right">
          <Link href="/" className="text-xl font-bold text-primary">ChatForYou.io</Link>
          {(session && session.data ) && (
            <div className="flex gap-4">
              <button onClick={handleProfile}>
                <CustomImage src="/images/icon-user.svg" alt="room" width={36} height={36} className="border-2 border-gray-700 rounded-full" />
              </button>
            </div>
          )}
        </div>
        {isProfileActive && (
          <div className="absolute right-0 m-4">
            <ProfileCard onActiveUserUpdateForm={() => setIsUserUpdateForm(true)} />
          </div>
        )}
      </div>
      {isUserUpdateForm && (
        <>
          <div className="absolute top-0 left-0 flex-center w-full h-full bg-black opacity-50"></div>
          <div className="absolute top-0 left-0 flex-center w-full h-full">
            <UserUpdateForm onClose={() => setIsUserUpdateForm(false)} />
          </div>
        </>
      )}
    </>
  );
}