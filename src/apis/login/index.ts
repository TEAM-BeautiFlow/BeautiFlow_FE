import api from "../axiosInstance";

export type KakaoLoginRole = "customer" | "staff";

// 카카오 인증 URL 생성 (고객/관리자 분기)
export function getKakaoAuthUrl(role: KakaoLoginRole = "customer") {
  const isCustomer = role === "customer";
  const clientId = isCustomer
    ? (import.meta.env.VITE_KAKAO_CUSTOMER_REST_API_KEY as string | undefined)
    : (import.meta.env.VITE_KAKAO_STAFF_REST_API_KEY as string | undefined);

  const redirectUriRaw = isCustomer
    ? (import.meta.env.VITE_KAKAO_CUSTOMER_REDIRECT_URI as string | undefined)
    : (import.meta.env.VITE_KAKAO_STAFF_REDIRECT_URI as string | undefined);

  // 하위 호환 (기존 단일 키 사용 시)
  const fallbackClientId = import.meta.env.VITE_KAKAO_REST_API_KEY as
    | string
    | undefined;
  const fallbackRedirect = import.meta.env.VITE_KAKAO_REDIRECT_URI as
    | string
    | undefined;

  const resolvedClientId = clientId ?? fallbackClientId;
  const resolvedRedirectUri = redirectUriRaw ?? fallbackRedirect;

  // 서버 사이드 OAuth(Spring Security) 방식 감지: redirect가 /login/oauth2/code로 끝나는 경우
  const isServerManagedOAuth =
    !!resolvedRedirectUri &&
    resolvedRedirectUri.includes("/login/oauth2/code/");
  if (isServerManagedOAuth) {
    const base =
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
    const registrationId = isCustomer ? "kakao-customer" : "kakao-staff";
    if (!base) {
      console.warn(
        "VITE_API_BASE_URL가 비어 있습니다. 서버 사이드 OAuth 리다이렉트에 절대경로가 필요해요.",
      );
    }
    // 예: https://beautiflow.co.kr/oauth2/authorization/kakao-customer
    return `${base}/oauth2/authorization/${registrationId}`;
  }

  const redirectUri = encodeURIComponent(resolvedRedirectUri ?? "");
  const state = encodeURIComponent(
    (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(
      0,
      16,
    ),
  );
  const scope = encodeURIComponent("profile_nickname account_email");
  const authorizeEndpoint =
    (import.meta.env.VITE_KAKAO_AUTHORIZE_ENDPOINT as string | undefined) ??
    "https://kauth.kakao.com/oauth/authorize/kakao-staff";

  return `${authorizeEndpoint}?response_type=code&client_id=${resolvedClientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
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
  const { data } = await api.post("/auth/phone/send-code", { phoneNumber });
  return data?.data ?? data;
}

// 휴대폰 인증: 인증번호 검증
export async function verifyPhoneCode(phoneNumber: string, code: string) {
  const { data } = await api.post("/auth/phone/verify-code", {
    phoneNumber,
    code,
  });
  return data?.data ?? data;
}
