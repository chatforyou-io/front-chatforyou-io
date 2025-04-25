import { z } from "zod";

export const userUpdateSchema = z.object({
  nickName: z
    .string()
    .min(1, "닉네임을 입력해주세요.")
    .max(10, "닉네임은 10자 이하로 입력해주세요."),
});

export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;