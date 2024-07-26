import React, { useRef } from 'react';

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

interface SignUpChatroomProps {
  onSubmit: (formData: FormData) => void;
}

export default function SignUpChatroom({ onSubmit }: SignUpChatroomProps) {
  const mySessionIdRef = useRef<HTMLInputElement>(null);
  const myUserNameRef = useRef<HTMLInputElement>(null);
  const maxUserCountRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mySessionId = mySessionIdRef.current!.value;
    const myUsername = myUserNameRef.current!.value;
    const maxUserCount = parseInt(maxUserCountRef.current!.value);

    onSubmit({ mySessionId, myUsername, maxUserCount });
  }

  return (
    <form className="w-full max-w-xl" onSubmit={handleSubmit}>
      <div className='flex justify-between gap-8 mt-8 w-full'>
        <p className="py-4 w-36 text-gray-700 text-xl font-semibold">제목</p>
        <input
          type="text"
          ref={mySessionIdRef}
          className="border px-6 py-4 w-full max-w-[27rem] bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
          placeholder="제목"
          defaultValue="SessionA"
          required
        />
      </div>
      <div className='flex justify-between gap-8 mt-8 w-full'>
        <p className="py-4 w-36 text-gray-700 text-xl font-semibold">닉네임</p>
        <input
          type="text"
          ref={myUserNameRef}
          className="border px-6 py-4 w-full max-w-[27rem] bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
          placeholder="닉네임"
          defaultValue={"Participant" + Math.floor(Math.random() * 100)}
          required
        />
      </div>
      <div className='flex justify-between gap-8 mt-8 w-full'>
        <p className="py-4 w-36 text-gray-700 text-xl font-semibold">접속인원</p>
        <input
          type="text"
          ref={maxUserCountRef}
          className="border px-6 py-4 w-full max-w-[27rem] bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
          placeholder="접속인원"
          defaultValue="2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full"
      >방 만들기</button>
    </form>
  );
}

