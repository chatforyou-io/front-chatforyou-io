import { z } from "zod";

export const userUpdateSchema = z.object({
  nickName: z
    .string()
    .min(1, "닉네임을 입력해주세요.")
    .max(20, "닉네임은 20자 이하로 입력해주세요."),
});

export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;