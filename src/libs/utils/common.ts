import { AxiosError } from "axios";

const handleAxiosError = (error: AxiosError) => {
  return { isSuccess: false, status: error.response?.status || 500, message: error.message };
};

export { handleAxiosError };