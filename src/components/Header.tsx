'use client';

import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, MouseEvent } from "react";
import PrimaryButton from "./atoms/Button/PrimaryButton";
import { useRouter } from "next/navigation";

export default function Header() {
  const session = useSession();
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const [isProfileActive, setIsProfileActive] = useState<boolean>(false);
  const router = useRouter();

	const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
	};
  
  function handleProfile(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    
    if (!session || !session.data) return;

    setIsProfileActive(!isProfileActive);
  }

  function handleSignOut(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    signOut({ callbackUrl: '/auth/login'});
  }

  const moveToTest = () => {
    router.push('/test');
  }

  return (
    <div className="absolute top-0 w-full">
      <div className="flex justify-between items-center border-b border-gray-400 bg-white px-4 py-2 h-20 text-right transition-colors duration-500">
        <Link href="/" className="text-3xl font-bold text-blue-500 transition-colors duration-500">ChatForYou.io</Link>
        <div className="flex gap-4">
          <PrimaryButton onClick={moveToTest} label={"테스트"} />
          {
            false &&
            <label
              htmlFor="toggle"        
              onClick={handleDarkMode}
              className="flex items-center relative w-14 h-8 bg-gray-700 rounded-full cursor-pointer transition-all duration-500"
            >
              <span className="absolute left-0 m-1 w-6 h-6 bg-gray-400 rounded-full transition-all duration-500"></span>
            </label>
          }
          <button onClick={handleProfile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 bg-gray-700 stroke-gray-200 fill-gray-200 rounded-full"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className={clsx("absolute border border-gray-400 mx-4 w-40 bg-white px-4 py-2 text-right rounded transition-all duration-500", {"opacity-100 right-0" : isProfileActive, "opacity-0 -right-4": !isProfileActive})}>
        <button onClick={handleSignOut} className="font-bold text-gray-700 transition-colors duration-500">로그아웃</button>
      </div>
    </div>
  );
}