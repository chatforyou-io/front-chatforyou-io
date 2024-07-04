import React, { useRef } from 'react';

interface FormData {
  mySessionId: string;
  myUsername: string;
  maxUserCount: number;
}

interface SignUpRoomProps {
  onSubmit: (formData: FormData) => void;
}

export default function SignUpRoom({ onSubmit }: SignUpRoomProps) {
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
    <form className="w-full max-w-md" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={mySessionIdRef}
        className="border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
        placeholder="제목"
        defaultValue="SessionA"
        required
      />
      <input
        type="text"
        ref={myUserNameRef}
        className="border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
        placeholder="참가자 이름"
        defaultValue={"Participant" + Math.floor(Math.random() * 100)}
        required
      />
      <input
        type="text"
        ref={maxUserCountRef}
        className="border mt-8 px-6 py-4 w-full bg-gray-100 text-xl text-gray-700 placeholder-gray-700 outline-none rounded-full"
        placeholder="최대 참가자 수"
        defaultValue="2"
        required
      />
      <button
        type="submit"
        className="w-full border mt-8 px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full"
      >방 만들기</button>
    </form>
  );
}

