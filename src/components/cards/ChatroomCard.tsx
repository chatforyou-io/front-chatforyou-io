import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ChatroomCardProps {
  chatroom: Chatroom;
}

const ChatroomCard: React.FC<ChatroomCardProps> = ({ chatroom }) => {
  return (
    <Link href={`/chatroom/view/${chatroom.sessionId}`} className="px-4 py-6 w-80 h-72 space-y-4 bg-white rounded-xl">
      <div className="flex gap-4">
        <Image src="/images/icon-exclamation-circle.svg" alt="room" width={20} height={20} />
        <p className="text-sm text-gray-500">{chatroom.roomName}</p>
      </div>
      <div className="flex gap-4 px-3">
        <p className="text-xs text-gray-500">설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명</p>
      </div>
      <div className="flex justify-between gap-4 border-t pt-6">
        <div className="flex gap-4">
          <Image src="/images/icon-exclamation-circle.svg" alt="room" width={20} height={20} />
          <p className="text-sm text-gray-500">10 / {chatroom.maxUserCount}</p>
        </div>
        <div className="flex gap-4">
          <p className="text-sm text-gray-500">{chatroom.roomName}</p>
          <Image src="/images/icon-exclamation-circle.svg" alt="room" width={20} height={20} />
        </div>
      </div>
      <div className="flex justify-between gap-4 border-t pt-6">
        <div className='flex gap-2'>
          <Image src="/images/icon-exclamation-circle.svg" alt="room" width={40} height={40} />
          <div>
            <h3 className="font-semibold text-gray-800">Username</h3>
            <p className="text-sm text-gray-500">user@mail.com</p>
          </div>
        </div>
        <div className='flex gap-4'>
          <Image src="/images/icon-exclamation-circle.svg" alt="room" width={40} height={40} />
        </div>
      </div>
    </Link>
  );
};

export default ChatroomCard;