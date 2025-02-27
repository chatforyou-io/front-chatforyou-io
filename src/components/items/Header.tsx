"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileCard from "@/src/components/cards/ProfileCard";
import UserUpdateForm from "@/src/components/forms/UserUpdateForm";
import Modal from "@/src/components/items/Modal";
import { useUser } from "@/src/contexts/AuthProvider";
import IconUser from "@/public/images/icon-user.svg";

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();
	const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isUserUpdateFormOpen, setIsUserUpdateFormOpen] = useState<boolean>(false);

  console.log(user);
  
  const handleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  }

  const handleActiveUserUpdateForm = () => {
    setIsProfileOpen(false);
    setIsUserUpdateFormOpen(true);
  }

  const handleSignOut = async () => {
    logout();
    setIsProfileOpen(false);
    router.push("/");
  }

  return (
    <>
      <div className="flex flex-shrink-0 justify-between items-center px-4 w-full h-20 bg-white">
        <Link href="/" className="text-xl font-bold text-primary">ChatForYou.io</Link>
        {user && (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleProfile}
              aria-label="profile">
              <IconUser aria-label="room" width={36} height={36} className="border-2 border-gray-700 rounded-full" />
            </button>
          </div>
        )}
      </div>
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
        <ProfileCard onActiveUserUpdateForm={() => handleActiveUserUpdateForm()} onSignOut={() => handleSignOut()} />
      </Modal>
      <Modal isOpen={isUserUpdateFormOpen} onClose={() => setIsUserUpdateFormOpen(false)}>
        <UserUpdateForm onClose={() => setIsUserUpdateFormOpen(false)} />
      </Modal>
    </>
  );
}