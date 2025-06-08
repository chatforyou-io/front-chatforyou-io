import ChatroomCard from "@/src/components/cards/ChatroomCard";
import IconPlus from "@/public/images/icons/plus.svg";

interface ChatroomListProps {
  chatrooms: Chatroom[];
  toggleChatroomCreateForm: () => void;
}

export default function ChatroomList({ chatrooms, toggleChatroomCreateForm }: ChatroomListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto w-full">
      <button
        type="button"
        className="flex flex-col justify-center items-center w-full h-44 bg-white hover:bg-blue-300 rounded-2xl shadow-xl"
        onClick={toggleChatroomCreateForm}
      >
        <IconPlus aria-label="plus" width={24} height={24} className="text-black" />
      </button>
      {chatrooms.map((chatroom, index) => (
        <ChatroomCard chatroom={chatroom} />
      ))}
    </div>
  );
}
