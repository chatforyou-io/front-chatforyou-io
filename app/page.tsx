import Articles from "@/components/Articles";
import ChatRooms from "@/components/ChatRooms";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-white transition-colors duration-500">
      <Header />
      <div className="flex flex-col mt-12 p-4 w-full max-w-xl h-full">
        <div className="flex flex-col my-8">
          <Link href="/articles" className="px-4 text-2xl font-bold text-gray-700">게시글</Link>
          <Articles />
        </div>
        <div className="flex flex-col my-8">
          <Link href="/chatroom" className="px-4 text-2xl font-bold text-gray-700">채팅 목록</Link>
          <ChatRooms />
        </div>
      </div>
    </main>
  );
}
