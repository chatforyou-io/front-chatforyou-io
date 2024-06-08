import Articles from "@/components/Articles";
import ChatRooms from "@/components/ChatRooms";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full bg-gray-200 dark:bg-gray-900 transition-colors duration-500">
      <Header />
      <div className="border-x border-gray-400 mt-12 p-4 w-full max-w-xl h-full bg-white dark:bg-gray-700">
        <div className="flex flex-col my-8">
          <Link href="/articles" className="px-4 text-2xl font-bold text-gray-700 dark:text-gray-300">게시글</Link>
          <Articles />
        </div>
        <div className="flex flex-col my-8">
          <Link href="/chatroom" className="px-4 text-2xl font-bold text-gray-700 dark:text-gray-300">채팅 목록</Link>
          <ChatRooms />
        </div>
      </div>
    </main>
  );
}
