import React from 'react';
import { useRouter } from 'next/navigation';
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
      className="flex flex-col justify-between gap-4 p-4 w-full h-44 bg-white hover:bg-blue-300 rounded-2xl shadow-xl transition-colors duration-200"
      aria-label={`채팅방: ${chatroom.roomName}`}
    >
      <div className="flex flex-col justify-between gap-4">
        <h1 className="text-lg text-left font-bold">{chatroom.roomName}</h1>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm">인원수: {chatroom.currentUserCount} / {chatroom.maxUserCount}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-4 border-t border-gray-700 pt-4">
        <div className="flex space-x-2 w-full">
          <IconUser aria-label="room" width={40} height={40} className="w-10 h-10 border-2 border-gray-700 rounded-full" />
          <div>
            <h3 className="text-left font-semibold">{chatroom.creator}</h3>
            <p className="text-sm text-left">{chatroom.roomName}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatroomCard;