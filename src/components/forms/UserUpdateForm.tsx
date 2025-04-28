import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@/src/contexts/SessionContext';
import { userUpdateSchema, UserUpdateSchemaType } from '@/src/schemas/userUpdateSchema';

interface UserUpdateFormProps {
  onClose: () => void;
}

export default function UserUpdateForm({ onClose }: UserUpdateFormProps) {
  const { user, updateUser, deleteUser } = useSession();
  const router = useRouter();

  // 회원 정보 수정 유효성 검사
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserUpdateSchemaType>({
    resolver: zodResolver(userUpdateSchema),
  });

  // 회원 정보 수정 제출
  const processSubmit = async ({ nickName }: UserUpdateSchemaType) => {
    try {
      const { isSuccess, message } = await updateUser(user?.idx!, nickName);

      // 회원 정보 수정 실패 시
      if (!isSuccess) {
        setError("root", { message });
        return;
      }

      // 회원 정보 수정 후 회원 정보 수정 폼 닫기
      onClose();

      // 회원 정보 수정 후 세션 업데이트
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("root", { message: "알 수 없는 오류로 회원 정보 수정에 실패했습니다. 다시 시도해주세요." });
    }
  };

  // 회원 탈퇴 제출
  const handleDelete = async () => {
    try {
      const { isSuccess, message } = await deleteUser(user?.idx!);

      // 회원 탈퇴 실패 시
      if (!isSuccess) {
        throw new Error(message);
      }
  
      // 회원 탈퇴 성공 시 로그인 페이지로 이동
      router.push('/auth/login');

      // 회원 정보 삭제 후 회원 정보 수정 폼 닫기
      onClose();

      // 회원 정보 삭제 후 세션 업데이트
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 w-144 space-y-8 bg-white rounded-xl">
      <h1 className="text-2xl text-primary font-bold">회원 정보 수정</h1>
      <form className="space-y-4" onSubmit={handleSubmit(processSubmit)}>
        <div className="space-y-2">
          <h3 className="font-semibold">닉네임</h3>
          <div className="space-y-2">
            <input
              type="text"
              className={clsx("border px-4 h-16 w-full bg-gray-100 rounded-full", {
                "border-red-500": errors.nickName,
              })}
              placeholder="닉네임"
              aria-label="닉네임"
              defaultValue={user?.nickName}
              {...register("nickName")}
            />
            {errors.nickName && <p className="text-red-500">{errors.nickName.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex space-x-4">
            <button
              type="button"
              className={clsx("w-full px-4 h-16 border bg-gray-100 rounded-full", {
                "border-red-500": errors.root,
              })}
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className={clsx("w-full px-4 h-16 border bg-primary text-white rounded-full", {
                "border-red-500": errors.root,
              })}
            >
              수정
            </button>
          </div>
          {errors.root && <p className="text-red-500">{errors.root.message}</p>}
        </div>
      </form>
      <div className="mt-8 text-center">
        <button
          type="button"
          className={clsx("text-neutral-500 hover:text-neutral-400 text-center font-semibold", {
            "text-red-500": errors.root,
          })}
          onClick={handleDelete}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}