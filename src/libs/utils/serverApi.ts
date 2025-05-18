import axios from "axios";
import { cookies } from "next/headers";

const authHost = process.env.NEXT_PUBLIC_API_DOMAIN;

const serverApi = axios.create({
  baseURL: authHost,
  timeout: 3000,
});

serverApi.interceptors.request.use(
  (config) => {
    const url = config.url;

    if (url?.includes("/auth/")) {
      return config;
    }

    const accessToken = cookies().get("AccessToken")?.value;
    const refreshToken = cookies().get("RefreshToken")?.value;

    if (accessToken || refreshToken) {
      if (url === "/chatforyouio/auth/refresh_token") {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers.RefreshToken = `Bearer ${refreshToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default serverApi;