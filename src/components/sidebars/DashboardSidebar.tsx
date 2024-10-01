import Image from 'next/image';
import { FC, useState } from 'react';

const DashboardSidebar: FC<any> = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="p-8 w-80 min-w-80 h-full bg-white rounded">
      <h3 className="text-2xl font-semibold text-gray-800">사용자 목록(00명)</h3>
      <div className="flex flex-col gap-4 mt-8 w-full h-full">
        <div className="flex items-center gap-2 w-full">
          <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={36} height={36} className="border-2 border-black rounded-full" />
          <p className="text-lg text-gray-800">User Name</p>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={36} height={36} className="border-2 border-black rounded-full" />
          <p className="text-lg text-gray-800">User Name</p>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={36} height={36} className="border-2 border-black rounded-full" />
          <p className="text-lg text-gray-800">User Name</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;