import Image from 'next/image';
import { FC } from 'react';

const DashboardSidebar: FC<any> = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="p-8 w-72 h-full bg-white rounded">
      <h3 className="text-xl font-semibold">사용자 목록(00명)</h3>
      <div className="flex flex-col gap-4 mt-8 w-full h-full">
        <div className="flex items-center gap-2 w-full">
          <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={36} height={36} className="border-2 border-gray-700 rounded-full" />
          <span>User Name</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={36} height={36} className="border-2 border-gray-700 rounded-full" />
          <span>User Name</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Image src={`${basePath}/images/icon-user.svg`} alt="room" width={36} height={36} className="border-2 border-gray-700 rounded-full" />
          <span>User Name</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;