import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

const authHost = process.env.API_AUTH_HOST;
const authUsername = process.env.API_AUTH_USERNAME;
const authPassword = process.env.API_AUTH_PASSWORD;
const authToken = btoa(authUsername + ":" + authPassword);

const instance = axios.create({
  baseURL: authHost,
  timeout: 1000,
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