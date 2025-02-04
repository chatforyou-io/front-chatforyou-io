import { useState } from "react";

interface FormErrors {
  username?: string;
  password?: string;
  login?: string;
};

const useLoginValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateUsername = (username: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(username);
  };

  const validatePassword = (password: string): boolean => {
    const numberReg = /[0-9]/;
    const alphabetsReg = /[a-zA-Z]/;
    const specialCharReg = /[~!@#$%^&*()_+|<>?:{}]/;
    return password.length >= 8 && numberReg.test(password) && alphabetsReg.test(password) && specialCharReg.test(password);
  };

  const validate = (username: string, password: string): boolean => {
    const newErrors: FormErrors = {};

    if (!username) {
      newErrors.username = "이메일 주소를 입력하세요.";
    } else if (!validateUsername(username)) {
      newErrors.username = "유효한 이메일 주소를 입력하세요.";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (!validatePassword(password)) {
      newErrors.password = "비밀번호는 8자 이상, 숫자, 영문자, 특수문자를 포함해야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, setErrors, validate };
};

export { useLoginValidation };