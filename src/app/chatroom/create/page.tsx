"use client";

import ChatroomCreateForm from "@/src/components/forms/ChatroomCreateForm";

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

export default function Page() {
  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
  }
  
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center p-12 w-full max-w-xl bg-white rounded-3xl">
        <h1 className="text-primary-normal text-[40px] font-semibold">New Room</h1>
        <div className="mt-12 w-full">
          <ChatroomCreateForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
