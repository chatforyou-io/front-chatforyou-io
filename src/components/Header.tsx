'use client';

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, MouseEvent } from "react";
import ProfileCard from "@/src/components/cards/ProfileCard";

export default function Header() {
  const session = useSession();
	const [isProfileActive, setIsProfileActive] = useState<boolean>(false);
  
  function handleProfile(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setIsProfileActive(!isProfileActive);
  }

  return (
    <div className="absolute top-0 w-full">
      <div className="flex justify-between items-center bg-white px-4 py-2 h-20 text-right transition-colors duration-500">
        <Link href="/" className="text-3xl font-bold text-blue-500 transition-colors duration-500">ChatForYou.io</Link>
        {(session && session.data ) && (
          <div className="flex gap-4">
            <button onClick={handleProfile}>
              <Image src="/images/icon-user.svg" alt="room" width={36} height={36} className="border-2 border-black rounded-full" />
            </button>
          </div>
        )}
      </div>
      <div className={clsx("absolute m-4", {"opacity-100 right-0" : isProfileActive, "opacity-0 -right-4": !isProfileActive})}>
        <ProfileCard />
      </div>
    </div>
  );
}