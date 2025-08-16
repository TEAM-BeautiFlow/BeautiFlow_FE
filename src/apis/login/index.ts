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

export async function login(loginKey: string) {
  const { data } = await api.post("/users/login", { loginKey });
  // 공통 응답 언래핑
  const payload = data?.data ?? data;

  // 로그인 응답 기반으로 안전 저장 (필드 존재 시에만)
  if (payload?.accessToken) {
    localStorage.setItem("accessToken", payload.accessToken);
  }
  if (payload?.refreshToken) {
    localStorage.setItem("refreshToken", payload.refreshToken);
  }
  if (payload?.kakaoId) {
    localStorage.setItem("kakaoId", payload.kakaoId);
  }
  if (payload?.provider) {
    const prov = payload.provider.startsWith("kakao-")
      ? payload.provider
      : `kakao-${payload.provider}`;
    localStorage.setItem("loginProvider", prov);
    localStorage.setItem("provider", prov);
  }
  return payload;
}

// 회원가입 API
export async function postSignup(params: {
  kakaoId: string;
  provider: string;
  name: string;
  contact: string;
  email: string;
}) {
  console.log("📡 API 호출 시작 - postSignup:", params);
  console.log("📡 요청 URL:", `/users/signup`);

  const { data } = await api.post("/users/signup", params);
  console.log("📡 API 응답 받음:", data);

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

// 샵 생성 API
export type CreateShopRequest = {
  name: string;
  address: string;
  businessRegistrationNumber: string;
};

export type ShopMember = {
  id: number;
  shopId: number;
  userId: number;
  role: "OWNER" | "MANAGER" | "STAFF" | string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  appliedAt?: string;
  processedAt?: string;
};

export type CreateShopResponse = {
  id: number;
  name: string;
  address: string;
  businessRegistrationNumber: string;
  shopMember?: ShopMember;
};

export async function createShop(payload: CreateShopRequest) {
  const { data } = await api.post("/shops", payload);
  return (data?.data ?? data) as CreateShopResponse;
}

// 샵 존재 여부 확인 (사업자등록번호)
export async function checkShopExists(businessRegistrationNumber: string) {
  const { data } = await api.get("/shops/exists", {
    params: { businessRegistrationNumber },
  });
  return data?.data ?? data; // { exists: boolean, shop: { id, ... } }
}

// 직원 입사 신청
export async function applyShop(shopId: number) {
  const { data } = await api.post(`/shops/${shopId}/apply`);
  return data?.data ?? data;
}
