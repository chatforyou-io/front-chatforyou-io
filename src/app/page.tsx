import ChatroomCreateBar from "@/src/components/bars/ChatroomCreateBar";
import UsersBar from "@/src/components/bars/UsersBar";
import Header from "@/src/components/items/Header";
import ChatroomList from "@/src/components/lists/ChatroomList";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center size-full bg-white md:bg-gray-200">
      <Header />
      <main className="flex flex-row-reverse justify-start w-md md:w-full h-full bg-white md:bg-gray-200">
        <div className="flex flex-col items-center md:items-start md:pl-48 w-md md:w-full h-full">
          <div className="p-4 w-md md:w-full">
            <ChatroomCreateBar />
          </div>
          <div className="flex items-start size-full pt-4 px-4 overflow-y-auto">
            <ChatroomList />
          </div>
        </div>
        <div className="absolute left-0 h-full bg-white">
          <UsersBar />
        </div>
      </main>
    </div>
  );
}
