import { z } from "zod";

export const chatroomCreateSchema = z.object({
  roomName: z
    .string()
    .nonempty("방 이름을 입력해주세요.")
    .min(1, "방 이름을 입력해주세요."),
  maxUserCount: z.coerce
    .number()
    .min(2, "최대 접속 인원을 입력해주세요."),
  usePwd: z.boolean(),
  pwd: z.string(),
}).refine((data) => data.usePwd ? data.pwd.trim().length > 0 : true, {
  message: "암호를 입력해주세요.",
  path: ["pwd"],
});

export type ChatroomCreateSchemaType = z.infer<typeof chatroomCreateSchema>;