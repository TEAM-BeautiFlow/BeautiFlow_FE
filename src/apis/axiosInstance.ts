import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const api = axios.create({
  baseURL: baseURL ?? "/",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use(config => {
  console.log("🌐 API 요청 시작:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    data: config.data,
  });

  // 우선 전역 스토어에서 토큰을 읽고, 없으면 localStorage 폴백
  const token =
    useAuthStore.getState().accessToken ?? localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 토큰 추가됨");
  } else {
    console.log("⚠️ 토큰 없음");
  }
  return config;
});

api.interceptors.response.use(
  res => {
    console.log("✅ API 응답 성공:", {
      status: res.status,
      url: res.config.url,
      data: res.data,
    });
    return res;
  },
  async error => {
    console.error("❌ API 응답 에러:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

export default api;
