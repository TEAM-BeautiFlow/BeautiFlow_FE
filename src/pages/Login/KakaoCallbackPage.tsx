import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeKakaoCode } from "@/apis/login";

export default function KakaoCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      try {
        await exchangeKakaoCode(code);
        // 서버 결정에 따르되, 프런트에서는 일단 회원가입 페이지로 이동
        navigate("/signup", { replace: true });
      } catch (e) {
        console.error(e);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">카카오 계정으로 로그인 중...</p>
    </main>
  );
}
