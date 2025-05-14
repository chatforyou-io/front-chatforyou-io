import { useContext } from "react";
import IconUser from "@/public/images/icon-user.svg";
import { OpenviduContext } from "@/src/contexts/OpenviduContext";

interface OpenviduHeaderProps {
  chatroom: Chatroom;
}

export default function OpenviduHeader({ chatroom }: OpenviduHeaderProps) {
  const { leaveSession } = useContext(OpenviduContext);

  const handleClick = () => {
    leaveSession();
    window.location.href = "/chatforyouio/front";
  };

  return (
    <>
      <div className="flex w-full space-x-4">
        <div className="flex justify-center items-center">
          <IconUser aria-label="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
        </div>
        <div className="w-full">
          <h3 className="font-semibold">{chatroom.roomName}</h3>
          <span className="text-sm">{chatroom.createDatetime}</span>
        </div>
        <div>
          <button
            type="button"
            onClick={handleClick}
            className="w-20 h-10 text-sm text-white bg-primary rounded-2xl">
            나가기
          </button>
        </div>
      </div>
      <div className="w-full text-sm">인원수: {chatroom.currentUserCount}명</div>
    </>
  );
}