import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconExclamationCircle from '@/public/images/icon-exclamation-circle.svg';
import IconUser from '@/public/images/icon-user.svg';

interface ChatroomCardProps {
  chatroom: Chatroom;
}

const ChatroomCard: React.FC<ChatroomCardProps> = ({ chatroom }) => {
  const router = useRouter();
  
  return (
    <button
      type="button"
      onClick={() => router.push(`/chatroom/view/${chatroom.sessionId}`)}
      className="flex flex-col gap-4 p-4">
      <div className="flex flex-col justify-between gap-4">
        <h1 className="text-lg font-bold">{chatroom.roomName}</h1>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconExclamationCircle aria-label="room" width={20} height={20} className="font-bold text-gray-700" />
            <p className="text-sm">{chatroom.currentUserCount} / {chatroom.maxUserCount}</p>
          </div>
          <Link
            href={`/chatroom/view/${chatroom.sessionId}`}
            className="w-24 h-8 leading-8 border border-primary bg-white font-semibold text-sm text-primary text-center rounded-full"
          >
            입장하기 &gt;
          </Link>
        </div>
      </div>
      <div className="flex justify-between gap-4 border-t pt-6">
        <div className="flex space-x-2 w-full">
          <IconUser aria-label="room" width={40} height={40} className="w-10 h-10 border-2 border-gray-700 rounded-full" />
          <div>
            <h3 className="font-semibold">{chatroom.creator}</h3>
            <p className="text-sm">{chatroom.roomName}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatroomCard;