import { useState } from "react";

interface SignUpErrors {
  name?: string;
  password?: string;
  confirmPwd?: string;
  login?: string;
};

const useSignUpValidation = () => {
  const [errors, setErrors] = useState<SignUpErrors>({});
  
  const validateName = (name: string): boolean => {
    return name.length >= 3;
  };

  const validatePassword = (password: string): boolean => {
    const numberReg = /[0-9]/;
    const alphabetsReg = /[a-zA-Z]/;
    const specialCharReg = /[~!@#$%^&*()_+|<>?:{}]/;
    return password.length >= 8 && numberReg.test(password) && alphabetsReg.test(password) && specialCharReg.test(password);
  };

  const validateConfirmPwd = (password: string, confirmPwd: string): boolean => {
    return password === confirmPwd;
  };

  const validate = (name: string, password: string, confirmPwd: string): boolean => {
    const newErrors: SignUpErrors = {};

    if (!name) {
      newErrors.name = "이름을 필수입니다.";
    } else if (!validateName(name)) {
      newErrors.name = "이름은 3자 이상이어야 합니다.";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (!validatePassword(password)) {
      newErrors.password = "비밀번호는 8자 이상, 숫자, 영문자, 특수문자를 포함해야 합니다.";
    }

    if (!confirmPwd) {
      newErrors.confirmPwd = "비밀번호 확인을 입력하세요.";
    } else if (!validateConfirmPwd(password, confirmPwd)) {
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, setErrors, validate };
};

export { useSignUpValidation };