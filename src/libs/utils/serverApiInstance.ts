import axios from "axios";
import { cookies } from "next/headers";

const authHost = process.env.NEXT_PUBLIC_API_DOMAIN;

const serverApiInstance = axios.create({
  baseURL: authHost,
  timeout: 3000,
});

serverApiInstance.interceptors.request.use(
  (config) => {
    const accessToken = cookies().get("AccessToken")?.value;
    const refreshToken = cookies().get("RefreshToken")?.value;

    if (accessToken || refreshToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers.RefreshToken = `Bearer ${refreshToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default serverApiInstance;