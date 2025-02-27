import { useUser } from '@/src/contexts/AuthProvider';
import IconUser from '@/public/images/icon-user.svg';

interface ProfileCardProps {
  onActiveUserUpdateForm: () => void;
  onSignOut: () => void;
}

export default function ProfileCard({ onActiveUserUpdateForm, onSignOut }: ProfileCardProps) {
  const { user } = useUser();
  
  return (
    <div className="w-80 bg-white p-8 space-y-8 rounded-xl">
      <div className="flex justify-center">
        <IconUser aria-label="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
      </div>
      <div className="flex flex-col items-center space-y-2">
        <h3 className="font-semibold">{user?.name}</h3>
        <p className="text-sm text-gray-500">{user?.id}</p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="py-2 text-center">
          <button type="button" onClick={onActiveUserUpdateForm}>회원 정보 수정</button>
        </div>
        <div className="border-t py-2 text-center">
          <button type="button" onClick={onSignOut}>로그아웃</button>
        </div>
      </div>
    </div>
  );
}