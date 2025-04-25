import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .nonempty("이메일 주소를 입력하세요.")
    .email("유효한 이메일 주소를 입력하세요."),
});

export type EmailSchemaType = z.infer<typeof emailSchema>;