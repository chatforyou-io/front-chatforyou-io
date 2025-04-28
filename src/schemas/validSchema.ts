import { z } from "zod";

export const validSchema = z.object({
  validCode: z
    .string(),
  confirmValidCode: z
    .string()
    .nonempty("인증번호를 입력하세요.")
    .length(8, "8자리 숫자를 입력하세요."),
}).refine((data) => data.confirmValidCode === data.validCode, {
  path: ["confirmValidCode"],
  message: "인증번호가 일치하지 않습니다.",
});

export type ValidSchemaType = z.infer<typeof validSchema>;