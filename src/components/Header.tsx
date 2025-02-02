"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import ProfileCard from "@/src/components/cards/ProfileCard";
import UserUpdateForm from "@/src/components/forms/UserUpdateForm";
import IconUser from "@/public/images/icon-user.svg";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export default function Header() {
  const session = useSession();
  const router = useRouter();
	const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isUserUpdateFormOpen, setIsUserUpdateFormOpen] = useState<boolean>(false);
  
  const handleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  }

  const handleActiveUserUpdateForm = () => {
    setIsProfileOpen(false);
    setIsUserUpdateFormOpen(true);
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setIsProfileOpen(false);
    router.push("/");
  }

  return (
    <>
      <div className="absolute top-0 w-full">
        <div className="flex justify-between items-center bg-white px-4 py-2 h-20 text-right">
          <Link href="/" className="text-xl font-bold text-primary">ChatForYou.io</Link>
          {(session && session.data ) && (
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