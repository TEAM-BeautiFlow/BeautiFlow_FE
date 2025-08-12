import api from "../axiosInstance";

export type KakaoLoginRole = "customer" | "staff";

// 카카오 인증 URL 생성 (서버 주도 방식으로 고정)
export function getKakaoAuthUrl(role: KakaoLoginRole = "customer") {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
  const registrationId = role === "customer" ? "kakao-customer" : "kakao-staff";
  if (!base) {
    console.warn("VITE_API_BASE_URL이 설정되어 있지 않습니다.");
  }
  return `${base}/oauth2/authorization/${registrationId}`;
}

// 백엔드로 코드 전달해 토큰/세션 발급
export async function exchangeKakaoCode(code: string) {
  const { data } = await api.post("/auth/kakao/callback", { code });
  // 예상 응답: { accessToken, refreshToken, user }
  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  return data;
}

// 회원가입 API
export async function postSignup(params: {
  kakaoId: string;
  provider: string;
  name: string;
  contact: string;
}) {
  const { data } = await api.post("/users/signup", params);
  const payload = data?.data ?? data;
  if (payload?.accessToken) {
    localStorage.setItem("accessToken", payload.accessToken);
  }
  if (payload?.refreshToken) {
    localStorage.setItem("refreshToken", payload.refreshToken);
  }
  return payload;
}

// 휴대폰 인증: 인증번호 전송
export async function sendPhoneCode(phoneNumber: string) {
  const { data } = await api.post("/users/auth/phone/send-code", {
    phoneNumber,
  });
  return data?.data ?? data;
}

// 휴대폰 인증: 인증번호 검증
export async function verifyPhoneCode(phoneNumber: string, code: string) {
  const { data } = await api.post("/users/auth/phone/verify-code", {
    phoneNumber,
    code,
  });
  return data?.data ?? data;
}
