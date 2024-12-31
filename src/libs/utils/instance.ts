import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/libs/utils/authOption";

const authHost = process.env.API_DOMAIN;

const instance = axios.create({
  baseURL: authHost,
  timeout: 3000,
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authOptions);
    if (session) {
      const token = session.user.accessToken;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default instance;