import clsx from "clsx";
import IconCircle from "@/public/images/icons/circle.svg";
import IconUser from "@/public/images/icon-user.svg";

interface UserItemProps {
  user: User;
  isCurrent: boolean;
}

export default function UserItem({ user, isCurrent }: UserItemProps) {
  return (
    <div className="flex items-center gap-4 px-4 w-full">
      <IconCircle
        aria-label="circle" 
        width={12} 
        height={12} 
        className={clsx("align-middle fill-current", { "text-green-500": isCurrent, "text-gray-400": !isCurrent })}
      />
      <IconUser 
        aria-label="user" 
        width={36} 
        height={36} 
        className="border-2 rounded-full border-gray-700 text-gray-700 fill-gray-700"
      />
      <span className=" align-middle text-gray-700 truncate">{user.name}</span>
    </div>
  )
}