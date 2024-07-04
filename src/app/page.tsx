import Articles from "@/src/components/Articles";
import ChatRooms from "@/src/components/ChatRooms";
import Header from "@/src/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-white transition-colors duration-500">
      <Header />
      <div className="flex flex-col mt-20 p-4 w-full max-w-xl h-full">
        <div className="flex flex-col my-8">
          <Link href="/articles" className="px-4 text-2xl font-bold text-gray-700">게시글</Link>
          <Articles />
        </div>
        <div className="flex flex-col my-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/chatroom" className="px-4 text-2xl font-bold text-gray-700">채팅 목록</Link>
            <Link href="/chatroom/write" className="border mt-8 px-6 py-4 bg-blue-500 text-xl text-white text-center rounded-full">방 만들기</Link>
          </div>
          <ChatRooms />
        </div>
      </div>
    </main>
  );
}
