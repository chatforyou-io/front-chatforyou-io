import clsx from "clsx";
import { useSession } from "@/src/contexts/SessionContext";
import { chatroomCreate } from "@/src/libs/chatroom";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatroomCreateSchema, ChatroomCreateSchemaType } from "@/src/schemas/chatroomCreateSchema";

interface ChatroomCreateFormProps {
  onClose: () => void;
}

export default function ChatroomCreateForm({ onClose }: ChatroomCreateFormProps) {
  const { user } = useSession();
  const userIdx = useMemo(() => user?.idx, [user?.idx]);
  const router = useRouter();

  // 방 만들기 폼 유효성 검사
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChatroomCreateSchemaType>({
    resolver: zodResolver(chatroomCreateSchema),
  });

  // 방 만들기 폼 제출
  const processSubmit = async ({ roomName, maxUserCount, usePwd, pwd }: ChatroomCreateSchemaType) => {
    try {
      const { isSuccess, message, roomData } = await chatroomCreate({roomName, maxUserCount, usePwd, pwd, userIdx });

      // 방 만들기 실패 시
      if (!isSuccess) {
        setError("root", { message });
        return;
      }

      // 방 만들기 성공 시 방 상세 페이지로 이동
      router.push(`/chatroom/view/${roomData.sessionId}`);
    } catch (error) {
      console.error(error);
      setError("root", { message: "알 수 없는 오류가 발생했습니다." });
    }
  };

  return (
    <form className="p-8 w-sm md:w-144 space-y-8 bg-white rounded-xl" onSubmit={handleSubmit(processSubmit)}>
      <h1 className="text-2xl text-primary font-bold">방 만들기</h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold">제목</h3>
          <div className="space-y-2">
            <input
              type="text"
              className={clsx("border px-4 h-16 w-full bg-gray-100 rounded-full", {
                "border-red-500": errors.roomName,
              })}
              placeholder="방 제목"
              aria-label="방 제목"
              {...register("roomName")}
            />
            {errors.roomName && <p className="text-red-500">{errors.roomName.message}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">최대 접속 인원</h3>
          <div className="space-y-2">
            <select
              className={clsx("border px-4 h-16 w-full bg-gray-100 rounded-full", {
                "border-red-500": errors.maxUserCount,
              })}
              aria-label="최대 접속 인원"
              {...register("maxUserCount")}
            >
              <option value="0">최대 접속 인원</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
            </select>
            {errors.maxUserCount && <p className="text-red-500">{errors.maxUserCount.message}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">암호</h3>
          <div className="space-y-2">
            <div className="flex gap-4">
              <input
                type="checkbox"
                aria-label="암호 사용 여부"
                {...register("usePwd")}
              />
              <input
                type="text"
                placeholder="방 비밀번호"
                className={clsx("border px-4 h-16 w-full bg-gray-100 rounded-full", {
                  "border-red-500": errors.pwd,
                })}
                aria-label="방 비밀번호"
                {...register("pwd")}
              />
            </div>
            {errors.pwd && <p className="text-red-500">{errors.pwd.message}</p>}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex gap-4">
          <button
            type="button"
            className={clsx("w-full px-4 h-16 leading-16 border bg-gray-100 text-center rounded-full", {
              "border-red-500": errors.root,
            })}
            aria-label="취소"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className={clsx("w-full px-4 h-16 border bg-primary text-white rounded-full", {
              "border-red-500": errors.root,
            })}
            aria-label="방 만들기"
          >
            방 만들기
          </button>
        </div>
        {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      </div>
    </form>
  );
}

