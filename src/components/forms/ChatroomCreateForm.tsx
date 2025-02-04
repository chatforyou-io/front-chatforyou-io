import { chatroomCreate } from "@/src/libs/chatroom";
import { useHandleRequestFail } from "@/src/webhooks/useHandleRequestFail";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useMemo } from "react";

interface ChatroomCreateFormProps {
  onClose: () => void;
}

export default function ChatroomCreateForm({ onClose }: ChatroomCreateFormProps) {
  const { data: userSession } = useSession();
  const userIdx = useMemo(() => userSession?.user.idx, [userSession?.user.idx]);
  const router = useRouter();
  const handleRequestFail = useHandleRequestFail();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const roomName = formData.get("roomName") as string || '';
    const maxUserCount = parseInt(formData.get("maxUserCount") as string) || 0;
    const usePwd = formData.get("usePwd") as string === "on";
    const pwd = formData.get("pwd") as string || '';

    if (!roomName || maxUserCount === 0) {
      alert("제목과 접속인원은 필수입니다.");
      return;
    }

    if (usePwd && !pwd) {
      alert("암호를 입력하세요.");
      return;
    }

    try {
      const data = await chatroomCreate({ roomName, maxUserCount, usePwd, pwd, userIdx });
      if (!data.isSuccess) throw new Error(handleRequestFail(data));

      router.push(`/chatroom/view/${data.roomData.sessionId}`);
    } catch (error) {
      console.error(error);
      alert("방 생성 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.");
    }
  };

  return (
    <form className="p-8 w-sm md:w-144 space-y-8 bg-white rounded-xl" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-primary font-bold">방 만들기</h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold">제목</h3>
          <input
            type="text"
            name="roomName"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="제목"
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">접속인원</h3>
          <select name="maxUserCount" className="border px-4 h-16 w-full bg-gray-100 rounded-full">
            <option value="">접속인원</option>
            <option value="2">2명</option>
            <option value="3">3명</option>
            <option value="4">4명</option>
          </select>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">암호</h3>
          <div className="flex gap-4">
            <input type="checkbox" name="usePwd" />
            <input
              type="text"
              name="pwdConfirm"
              className="border px-4 h-16 w-full bg-gray-100 rounded-full"
              placeholder="암호"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-9">
        <button
          type="button"
          className="w-full px-4 h-16 leading-16 border bg-gray-100 text-center rounded-full"
          onClick={onClose}
        >
          취소
        </button>
        <button
          type="submit"
          className="w-full px-4 h-16 border bg-primary text-white rounded-full"
        >
          방 만들기
        </button>
      </div>
    </form>
  );
}

