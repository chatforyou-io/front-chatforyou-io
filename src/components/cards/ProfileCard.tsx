import React, { MouseEvent } from "react";
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import CustomImage from "@/src/components/CustomImage";

interface ProfileCardProps {
  onActiveUserUpdateForm: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onActiveUserUpdateForm }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const router = useRouter();

  const session = useSession();

  const handleSignOut = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    try {
      const response = await signOut({ redirect: false, callbackUrl: `${basePath}/auth/login` });
      if (!response) {
        throw new Error('Unknown error');
      }

      // 로그인 성공 시 홈페이지로 리다이렉트
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <div className="w-80 bg-white p-8 space-y-8 rounded-xl">
      <div className="flex justify-center">
        <CustomImage src="/images/icon-user.svg" alt="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
      </div>
      <div className="flex flex-col items-center space-y-2">
        <h3 className="font-semibold">{session.data?.user?.name}</h3>
        <p className="text-sm text-gray-500">{session.data?.user?.id}</p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="py-2 text-center">
          <button onClick={onActiveUserUpdateForm}>프로필</button>
        </div>
        <div className="border-t py-2 text-center">
          <button onClick={handleSignOut}>로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;