import { loginSchema, LoginFormType } from "@/src/schemas/loginSchema";

export const validateLogin = (formData: LoginFormType) => {
  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    const formattedErrors: Partial<Record<keyof LoginFormType, string>> = {};
    result.error.errors.forEach((error) => {
      const field = error.path[0] as keyof LoginFormType;
      formattedErrors[field] = error.message;
    });
    
    return {
      isValid: false,
      errors: formattedErrors,
    };
  }

  return {
    isValid: true,
    errors: {},
  };
};
