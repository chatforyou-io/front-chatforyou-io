"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
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

serverApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirect(`${basePath}/auth/login`);
    }

    return Promise.reject(error);
  }
);

export default serverApiInstance;