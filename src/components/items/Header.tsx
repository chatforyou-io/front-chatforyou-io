"use client";

import { useState } from "react";
import Link from "next/link";
import ProfileCard from "@/src/components/cards/ProfileCard";
import UserUpdateForm from "@/src/components/forms/UserUpdateForm";
import Modal from "@/src/components/items/Modal";
import { useSession } from "@/src/contexts/SessionContext";
import IconUser from "@/public/images/icon-user.svg";
import IconLoader from "@/public/images/icons/loader.svg";

type ModalType = "profile" | "update" | null;

export default function Header() {
  const { user, signOut } = useSession();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const redirectToHome = () => window.location.href = "/";
  const openProfileModal = () => setActiveModal("profile");
  const openUserUpdateFormModal = () => setActiveModal("update");
  const closeModal = () => setActiveModal(null);

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  }

  return (
    <>
      <div className="flex justify-between items-center p-4 w-full h-20 bg-white">
        <button type="button" onClick={redirectToHome} className="text-2xl font-bold text-primary">ChatForYou.io</button>
        {user ? (
          <button type="button" onClick={openProfileModal} aria-label="profile">
            <IconUser aria-label="room" width={40} height={40} className="border-2 border-gray-700 rounded-full" />
          </button>
        ) : (
          <IconLoader className="w-10 h-10 animate-spin" aria-hidden="true" />
        )}
      </div>
      <Modal isOpen={activeModal === "profile"} onClose={closeModal}>
        <ProfileCard onActiveUserUpdateForm={openUserUpdateFormModal} onSignOut={handleSignOut} />
      </Modal>
      <Modal isOpen={activeModal === "update"} onClose={closeModal}>
        <UserUpdateForm onClose={closeModal} />
      </Modal>
    </>
  );
}