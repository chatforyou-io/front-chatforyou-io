import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/src/contexts/SessionContext';
import { userDelete, userUpdate } from '@/src/libs/user';
import { useHandleRequestFail } from '@/src/webhooks/useHandleRequestFail';

interface UserUpdateFormProps {
  onClose: () => void;
}

export default function UserUpdateForm({ onClose }: UserUpdateFormProps) {
  const { user, updateUser, deleteUser } = useSession();
  const router = useRouter();
  
  /**
   * 회원 정보 수정
   * @param event 이벤트
   */
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nickName = formData.get('nickName') as string;

    if (!nickName) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    
    try {
      if (!user) throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    
      const { idx } = user;
      if (!idx) throw new Error("사용자 정보를 가져오는데 실패했습니다.");

      // 회원 정보 수정
      const { isSuccess, message } = await updateUser(idx, nickName);

      // 회원 정보 수정 실패 시
      if (!isSuccess) {
        throw new Error(message || "알 수 없는 오류로 회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 회원 탈퇴
   * @param event 이벤트
   */
  const handleDelete = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    try {
      if (!user) throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    
      const { idx } = user;
      if (!idx) throw new Error("사용자 정보를 가져오는데 실패했습니다.");

      // 회원 탈퇴
      const { isSuccess, message } = await deleteUser(idx);

      // 회원 탈퇴 실패 시
      if (!isSuccess) {
        throw new Error(message || "알 수 없는 오류로 회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
  
      router.push('/auth/signin');
    } catch (error) {
      console.error('회원 탈퇴 요청 중 오류 발생:', error);
      alert('회원 탈퇴 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  };

  return (
    <div className="p-8 w-144 space-y-8 bg-white rounded-xl">
      <h1 className="text-2xl text-primary font-bold">회원 정보 수정</h1>
      <form className="space-y-4" onSubmit={handleUpdate}>
        <div className="space-y-2">
          <h3 className="font-semibold">이름</h3>
          <input
            type="text"
            name="name"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="이름"
            defaultValue={user?.name}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">닉네임</h3>
          <input
            type="text"
            name="nickName"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="닉네임"
            defaultValue={user?.nickName}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            className="w-full px-4 h-16 border bg-gray-100 rounded-full"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="w-full px-4 h-16 border bg-primary text-white rounded-full"
          >
            수정
          </button>
        </div>
      </form>
      <div className="mt-8 text-center">
        <button
          type="button"
          className="text-neutral-500 hover:text-neutral-400 text-center font-semibold"
          onClick={handleDelete}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}