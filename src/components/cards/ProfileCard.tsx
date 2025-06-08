import { useSession } from '@/src/contexts/SessionContext';
import IconUser from '@/public/images/icon-user.svg';

interface ProfileCardProps {
  onActiveUserUpdateForm: () => void;
  onSignOut: () => void;
}

export default function ProfileCard({ onActiveUserUpdateForm, onSignOut }: ProfileCardProps) {
  const { user } = useSession();
  
  return (
    <div className="w-56 bg-white p-8 space-y-4 rounded-2xl">
      <div className="flex justify-center">
        <IconUser aria-label="room" width={48} height={48} className="border-2 border-gray-700 rounded-full" />
      </div>
      <div className="flex flex-col items-center space-y-4">
        <h3 className="font-semibold">{user?.name}</h3>
        <p className="text-sm text-gray-700">{user?.id}</p>
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <button
          type="button"
          onClick={onActiveUserUpdateForm}
          className="border px-4 py-2 bg-primary hover:bg-blue-300 text-white rounded-2xl shadow-xl"
        >
          회원 정보 수정
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="border px-4 py-2 bg-primary hover:bg-blue-300 text-white rounded-2xl shadow-xl"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}