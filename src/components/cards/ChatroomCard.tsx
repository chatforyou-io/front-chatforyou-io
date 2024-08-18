import Image from 'next/image';
import React from 'react';

interface ChatroomCardProps {
}

const ChatroomCard: React.FC<ChatroomCardProps> = ({ }) => {
  return (
    <div className="px-6 bg-white rounded-xl">
      <div className="flex gap-3 py-6">
        <Image src="/images/icon-exclamation-circle.svg" alt="room" width={40} height={40} />
        <div>
          <h3 className="font-semibold text-gray-800">Username</h3>
          <p className="text-sm text-gray-500">user@mail.com</p>
        </div>
      </div>
      <div className="flex gap-3 border-t py-3">
        <Image src="/images/icon-exclamation-circle.svg" alt="room" width={20} height={20} />
        <p className="text-sm text-gray-500">Room Name</p>
      </div>
      <div className="flex gap-3 p-3">
        <p className="text-sm text-gray-500">설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 </p>
      </div>
      <div className="flex justify-between gap-3 border-t py-6">
        <div className="flex gap-3">
          <Image src="/images/icon-exclamation-circle.svg" alt="room" width={20} height={20} />
          <p className="text-sm text-gray-500">10 / 10</p>
        </div>
        <div className="flex gap-3">
          <p className="text-sm text-gray-500">Room Name</p>
          <Image src="/images/icon-exclamation-circle.svg" alt="room" width={20} height={20} />
          </div>
      </div>
    </div>
  );
};

export default ChatroomCard;