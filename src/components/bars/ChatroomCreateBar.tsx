"use client";

import { useState } from "react";
import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";
import Modal from "@/src/components/items/Modal";
import IconPlus from "@/public/images/icons/plus.svg";

export default function ChatroomCreateBar() {
  const [isPopup, setIsPopup] = useState(false);

  return (
    <div className="flex justify-end items-center gap-4 w-full">
      <input
        type="text"
        name="keyword"
        className="border px-4 h-16 w-full md:w-128 bg-white rounded-full focus:ring focus:ring-primary"
        placeholder="검색"
      />
      <button
        type="button"
        className="flex justify-center items-center w-24 lg:w-full lg:max-w-44 px-4 h-16 border bg-primary text-white rounded-full"
        onClick={() => setIsPopup(true)}
      >
        <IconPlus aria-label="plus" width={24} height={24} />
        <span className="hidden lg:inline-block">방 만들기</span>
      </button>
      <Modal isOpen={isPopup} onClose={() => setIsPopup(false)}>
        <ChatroomCreateForm onClose={() => setIsPopup(false)} />
      </Modal>
    </div>
  );
}