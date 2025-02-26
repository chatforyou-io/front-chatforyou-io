"use server";

import axios, { AxiosError, AxiosResponse } from "axios";
import { cookies } from "next/headers";

const authHost = process.env.API_DOMAIN;

const apiClient = axios.create({
  baseURL: authHost,
  timeout: 3000,
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = cookies().get('AccessToken')?.value;
    const refreshToken = cookies().get('RefreshToken')?.value;

    if (accessToken && refreshToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers.RefreshToken = refreshToken;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error),
);

export default apiClient;