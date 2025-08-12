import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const api = axios.create({
  baseURL: baseURL ?? "/",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use(config => {
  // 우선 전역 스토어에서 토큰을 읽고, 없으면 localStorage 폴백
  const token =
    useAuthStore.getState().accessToken ?? localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    return Promise.reject(error);
  },
);

export default api;
