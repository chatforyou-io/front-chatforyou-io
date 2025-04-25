import { z } from "zod";

export const validSchema = z.object({
  validCode: z
    .string()
    .nonempty("인증번호를 입력하세요.")
    .length(8, "8자리 숫자를 입력하세요."),
});

export type ValidSchemaType = z.infer<typeof validSchema>;