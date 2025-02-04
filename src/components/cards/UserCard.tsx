import IconUser from '@/public/images/icon-user.svg';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 w-full">
      <IconUser
        aria-label="user"
        width={36}
        height={36}
        className="border-2 border-gray-400 rounded-full text-gray-400 fill-gray-400"
      />
      <span className="text-gray-400">{user.name}</span>
    </div>
  );
}
