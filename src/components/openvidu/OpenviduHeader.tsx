import IconUser from "@/public/images/icon-user.svg";
import { useOpenVidu } from "@/src/contexts/OpenViduContext";

interface OpenViduHeaderProps {
  chatroom: Chatroom;
}

export default function OpenViduHeader({ chatroom }: OpenViduHeaderProps) {
  const { leaveSession } = useOpenVidu();

  // 나가기 버튼 클릭 시 세션 종료 후 이동
  const handleClick = () => {
    leaveSession();
    window.location.href = "/chatforyouio/front";
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex gap-4 w-full">
        <div className="flex justify-center items-center">
          <IconUser aria-label="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
        </div>
        <div className="w-full space-y-1">
          <h3 className="font-semibold">{chatroom.roomName}</h3>
          <p className="text-sm">{chatroom.createDatetime}</p>
          <p className="text-sm">인원수: {chatroom.currentUserCount}명</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="w-28 h-12 text-sm text-white bg-primary rounded-2xl shadow-md cursor-pointer">
        나가기
      </button>
    </div>
  );
}