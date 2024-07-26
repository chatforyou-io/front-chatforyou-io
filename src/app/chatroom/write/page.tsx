'use client';

import SignUpChatroom from "@/src/components/chatroom/SignUpChatroom";

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

export default function Page() {
  const getFormData = async (formData: FormData) => {
    console.log(formData);
  }
  
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-700 text-[2.5rem] font-semibold">방 만들기</h1>
      </div>
      <div className="mt-12 mx-auto px-8 w-full">
        <SignUpChatroom onSubmit={getFormData} />
      </div>
    </>
  );
}
