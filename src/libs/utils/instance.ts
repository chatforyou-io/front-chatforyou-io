import axios, { AxiosError, AxiosResponse } from "axios";

const authHost = process.env.API_DOMAIN;

const instance = axios.create({
  baseURL: authHost,
  timeout: 3000,
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  async (config) => {
    /*
    const session = await getServerSession(authOptions);
    if (session) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    */
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error),
);

export default instance;