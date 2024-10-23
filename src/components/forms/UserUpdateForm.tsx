import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { userUpdate } from '@/src/libs/auth';

interface UserUpdateFormProps {
  onClose: () => void;
}

export default function UserUpdateForm({ onClose }: UserUpdateFormProps) {
  const { data: userSession, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const nickName = formData.get('nickName') as string;

    if (!id || !name || !nickName) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    
    const user: User = { id, name, nickName };
    
    try {
      const data = await userUpdate(user);
      if (!data.isSuccess) throw new Error('User update failed');
  
      alert('회원 정보 수정에 성공하였습니다.');
    } catch (error) {
      console.error('회원 정보 수정 요청 중 오류 발생:', error);
      alert('회원 정보 수정 중 문제가 발생하였습니다. 나중에 다시 시도해주세요.');
    }
  }

  return (
    <form className="p-8 w-144 space-y-8 bg-white rounded-xl" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-primary font-bold">회원 정보 수정</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">아이디</h3>
          <input
            type="text"
            name="id"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="아이디"
            defaultValue={userSession?.user.id}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">이름</h3>
          <input
            type="text"
            name="name"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="이름"
            defaultValue={userSession?.user.name}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">닉네임</h3>
          <input
            type="text"
            name="nickName"
            className="border px-4 h-16 w-full bg-gray-100 rounded-full"
            placeholder="닉네임"
            defaultValue={userSession?.user.nickName}
          />
        </div>
      </div>
      <div className="flex gap-9">
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
  );
}