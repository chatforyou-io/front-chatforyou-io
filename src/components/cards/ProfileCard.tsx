import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import React, { MouseEvent } from "react";

interface ProfileCardProps {
}

const ProfileCard: React.FC<ProfileCardProps> = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const session = useSession();

  function handleSignOut(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    signOut({ callbackUrl: `${basePath}/auth/login` });
  }
  
  return (
    <div className="w-80 bg-white p-8 space-y-8 rounded-xl">
      <div className="flex justify-center">
        <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={48} height={48} className="border-2 border-black rounded-full" />
      </div>
      <div className="flex flex-col items-center space-y-2">
        <h3 className="font-semibold text-gray-800">{session.data?.user?.name}</h3>
        <p className="text-sm text-gray-500">{session.data?.user?.id}</p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="py-2 text-center">
          <button onClick={() => {}}>프로필</button>
        </div>
        <div className="border-t py-2 text-center">
          <button onClick={handleSignOut}>로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;