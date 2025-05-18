import clsx from "clsx";
import IconCircle from "@/public/images/icons/circle.svg";
import IconUser from "@/public/images/icon-user.svg";

interface UserCardProps {
  user: User;
  isCurrent: boolean;
}

export default function UserCard({ user, isCurrent }: UserCardProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 w-full bg-white hover:bg-gray-200 hover:animate-pulse">
      <div className="flex items-center gap-4">
        <IconCircle
          aria-label="circle" 
          width={12} 
          height={12} 
          className={clsx(
            "size-4 align-middle fill-current",
            {
              "text-green-500": isCurrent,
              "text-gray-400": !isCurrent
            }
          )}
        />
        <IconUser 
          aria-label="user" 
          width={36} 
          height={36} 
          className={clsx(
            "size-10 border-2 rounded-full",
            {
              "border-gray-700 text-gray-700 fill-gray-700": isCurrent,
              "border-gray-400 text-gray-400 fill-gray-400": !isCurrent
            }
          )}
        />
      </div>
      <span className="text-sm align-middle text-gray-700 truncate">{user.name}</span>
    </div>
  )
}