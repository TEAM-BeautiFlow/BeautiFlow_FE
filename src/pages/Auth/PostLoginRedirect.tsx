import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PostLoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("postLoginRedirect");
    if (stored) {
      localStorage.removeItem("postLoginRedirect");
      navigate(stored, { replace: true });
    }
    // stored가 없으면 아무 것도 하지 않음 (루트 유지)
  }, [navigate]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white">
      <p className="text-sm text-neutral-500">이동 중...</p>
    </main>
  );
}
