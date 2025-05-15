import ChatroomCard from "@/src/components/cards/ChatroomCard";

interface ChatroomListProps {
  chatrooms: Chatroom[];
}

export default function ChatroomList({ chatrooms }: ChatroomListProps) {
  if (chatrooms.length === 0) {
    return (
      <div className="flex justify-center items-center size-full">
        <p className="text-gray-500">채팅방이 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
      {chatrooms.map((chatroom, index) => (
        <div key={index} className="w-full bg-white rounded-2xl shadow-xl">
          <ChatroomCard chatroom={chatroom} />
        </div>
      ))}
    </div>
  );
}
