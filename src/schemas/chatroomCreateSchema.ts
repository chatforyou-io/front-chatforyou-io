import { z } from "zod";

export const chatroomCreateSchema = z.object({
  roomName: z
    .string()
    .nonempty("방 이름을 입력해주세요.")
    .min(2, "방 이름을 입력해주세요."),
  maxUserCount: z.coerce
    .number()
    .min(2, "최대 접속 인원을 입력해주세요."),
});

export type ChatroomCreateSchemaType = z.infer<typeof chatroomCreateSchema>;