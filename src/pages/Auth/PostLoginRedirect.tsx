import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login as requestLogin } from "@/apis/login";

export default function PostLoginRedirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loginKey = searchParams.get("loginKey");

    // 1) 서버에서 loginKey로 리디렉션된 경우: 로그인 확정 처리
    if (loginKey) {
      (async () => {
        try {
          const response = await requestLogin(loginKey);
          const payload = response?.data ?? response;

          const kakaoId = payload?.kakaoId ?? payload?.data?.kakaoId ?? null;
          const provider = payload?.provider ?? payload?.data?.provider ?? null;
          const isNewUserStr =
            payload?.isNewUser ?? payload?.data?.isNewUser ?? "false";
          const isNewUser = String(isNewUserStr).toLowerCase() === "true";

          const accessToken =
            payload?.accessToken ?? payload?.data?.accessToken ?? null;
          const refreshToken =
            payload?.refreshToken ?? payload?.data?.refreshToken ?? null;

          if (isNewUser) {
            // 이후 흐름에서 루트 재진입 시 signup으로 강제되지 않도록 미리 제거
            try {
              localStorage.removeItem("postLoginRedirect");
            } catch {}
            if (provider) {
              try {
                localStorage.setItem("loginProvider", provider);
              } catch {}
            }
            const qs = new URLSearchParams();
            if (kakaoId) qs.set("kakaoId", kakaoId);
            if (provider) qs.set("provider", provider);
            navigate(`/signup?${qs.toString()}`, { replace: true });
          } else {
            try {
              // 기존 유저도 postLoginRedirect 무시하고 루트로 가기 위해 제거
              localStorage.removeItem("postLoginRedirect");
              if (accessToken) localStorage.setItem("accessToken", accessToken);
              if (refreshToken)
                localStorage.setItem("refreshToken", refreshToken);
            } catch {}
            // 루트로 돌아가며 쿼리 정리
            navigate("/", { replace: true });
          }
        } catch (e) {
          // 실패 시 로그인 화면으로 복귀
          navigate("/login", { replace: true });
        }
      })();
      return;
    }

    // 2) 그 외: 기존 저장된 리다이렉트 목적지가 있으면 이동
    const stored = localStorage.getItem("postLoginRedirect");
    if (stored) {
      localStorage.removeItem("postLoginRedirect");
      navigate(stored, { replace: true });
    }
    // stored가 없으면 루트 유지
  }, [navigate, searchParams]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">이동 중...</p>
    </main>
  );
}
