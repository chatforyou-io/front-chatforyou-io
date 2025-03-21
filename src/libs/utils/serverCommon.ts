"use server";

import { AxiosError } from "axios";

interface AxiosErrorData {
  code: number;
  message: string;
}

const handleAxiosError = (error: AxiosError) => {
  const { code, message} = error.response?.data as AxiosErrorData || {};
  return { isSuccess: false, code, message };
};

export { handleAxiosError };