import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .nonempty("이름을 입력하세요.")
    .min(2, "이름은 2자 이상이어야 합니다."),
  pwd: z
    .string()
    .nonempty("비밀번호를 입력하세요.")
    .refine((pwd) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+|<>?:{}]).{8,}$/.test(pwd), {
      message: "비밀번호는 8자 이상, 숫자, 영문자, 특수문자를 포함해야 합니다.",
    }),
  confirmPwd: z
    .string()
    .nonempty("비밀번호 확인을 입력하세요.")
    .refine((confirmPwd) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+|<>?:{}]).{8,}$/.test(confirmPwd), {
      message: "비밀번호가 일치하지 않습니다.",
    }),
}).refine((data) => data.pwd === data.confirmPwd, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPwd"],
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
