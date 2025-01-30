import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { userDelete, userUpdate } from '@/src/libs/user';
import { useHandleRequestFail } from '@/src/webhooks/useHandleRequestFail';

interface UserUpdateFormProps {
  onClose: () => void;
}

export default function UserUpdateForm({ onClose }: UserUpdateFormProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const handleRequestFail = useHandleRequestFail();

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nickName = formData.get('nickName') as string;

    if (!nickName) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    
    const { idx } = session?.user;
    
    try {
      const data = await userUpdate(idx, nickName);
      if (!data.isSuccess) {
        const message = handleRequestFail(data);
        throw new Error(message);
      }
  
      alert('회원 정보 수정에 성공하였습니다.');

      const newNickName = data.userData.nickName;
      updateSession(newNickName);
    } catch (error) {
      console.error('회원 정보 수정 요청 중 오류 발생:', error);
      alert('회원 정보 수정 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  };

  const handleDelete = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    try {
      const { idx } = session?.user;
      const data = await userDelete(idx);
      if (!data.isSuccess) {
        const message = handleRequestFail(data);
        throw new Error(message);
      }
  
      alert('회원 탈퇴에 성공하였습니다.');
      router.push('/auth/login');
    } catch (error) {
      console.error('회원 탈퇴 요청 중 오류 발생:', error);
      alert('회원 탈퇴 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  };

  const updateSession = async (nickName: string) => {
    await update({
      ...session,
      user: {
        ...session?.user,
        nickName,
      },
    });
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
            defaultValue={session?.user.name}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">닉네임</h3>
          <input
            type="text"
            name="nickName"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="닉네임"
            defaultValue={session?.user.nickName}
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