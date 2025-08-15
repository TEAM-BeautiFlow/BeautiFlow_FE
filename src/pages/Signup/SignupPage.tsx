import { useEffect, useState } from "react";
import { sendPhoneCode, verifyPhoneCode, postSignup } from "@/apis/login";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import LeftChevron from "../../assets/icon_left-chevron.svg";

export default function SignupPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { isAuthenticated, provider: authProvider } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [kakaoId, setKakaoId] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    const k = search.get("kakaoId");
    const p = search.get("provider") || localStorage.getItem("loginProvider");
    if (k) setKakaoId(k);
    if (p) setProvider(p);
  }, [search]);

  // 기존 회원 체크: 이미 토큰이 있다면 (= 기존 회원) 적절한 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && authProvider) {
      const isStaff =
        typeof authProvider === "string" && authProvider.includes("staff");
      navigate(isStaff ? "/manager/home" : "/client/mypage", { replace: true });
    }
  }, [isAuthenticated, authProvider, navigate]);

  async function handleSendCode() {
    if (!phone) return;
    setIsSent(true);
    try {
      await sendPhoneCode(phone);
    } catch (e) {
      // 요청 실패 시에도 isSent 상태는 유지하여 버튼이 다시 활성화되지 않도록 함
    }
  }

  async function handleVerify() {
    if (!phone || !code) return;
    try {
      await verifyPhoneCode(phone, code);
      setIsVerified(true);
    } catch (e) {
      // 인증 실패 시 상태 유지
      console.error("인증번호 확인 실패:", e);
    }
  }

  async function handleSubmit() {
    if (!kakaoId || !provider || !name || !phone || !isVerified) return;
    try {
      await postSignup({
        kakaoId,
        provider,
        name,
        contact: phone,
        email: "test@test.com",
      });
      const isStaff =
        typeof provider === "string" && provider.includes("staff");
      navigate(isStaff ? "/manager/onboard" : "/client/mypage", {
        replace: true,
      });
    } catch (signupError) {
      // 이미 존재하는 사용자인 경우 로그인 처리로 리다이렉트
      console.error("회원가입 실패:", signupError);
      const isStaff =
        typeof provider === "string" && provider.includes("staff");
      navigate(isStaff ? "/manager/home" : "/client/mypage", {
        replace: true,
      });
    }
  }

  const canSubmit = !!(name && phone && isVerified);

  return (
    <div className="flex min-h-[812px] min-w-[375px] flex-col items-center justify-center">
      <div
        className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-hidden px-5 pt-8 pb-6"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 60%, #1E0C2D 100%)",
        }}
      >
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex w-full items-center">
          <button className="mr-2">
            <img src={LeftChevron} alt="뒤로가기" className="h-6 w-6" />
          </button>
          <div className="label1 flex-1 text-center text-[var(--color-white)]">
            회원가입
          </div>
        </div>
        {/* 폼 영역 */}
        <div className="flex w-full flex-1 flex-col gap-6">
          {/* 이름 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              이름 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="body2 mb-2 text-[var(--color-grey-550)]">
              고객의 예약 리스트에 노출할 이름을 적어주세요.
            </div>
            <input
              className={`body2 w-full rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${name ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
              placeholder="이름을 입력해주세요."
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* 휴대폰 인증 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              휴대폰 인증 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="body2 mb-2 text-[var(--color-grey-550)]">
              하이픈 (-)을 포함하여 숫자만 입력해주세요.
            </div>
            <div className="mb-4 flex gap-2">
              <input
                className={`body2 w-[243px] rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${phone ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                placeholder="연락처를 입력해주세요."
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <button
                type="button"
                className={`caption1 my-1 ml-3 w-[76px] rounded-[20px] border text-[var(--color-white)] ${phone && !isSent ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : "border-[var(--color-grey-550)]"}`}
                disabled={!phone || isSent}
                onClick={handleSendCode}
              >
                번호 인증
              </button>
            </div>
            {isSent && (
              <div className="mb-4 flex gap-2">
                <input
                  className={`body2 w-[243px] rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${code ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                  placeholder="인증번호"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                <button
                  type="button"
                  className={`caption1 my-1 ml-3 w-[76px] rounded-[20px] border text-[var(--color-white)] ${code ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : "border-[var(--color-grey-550)]"}`}
                  disabled={!code || isVerified}
                  onClick={handleVerify}
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 하단 버튼 */}
        <button
          onClick={handleSubmit}
          className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] transition-colors duration-200 ${canSubmit ? "bg-[var(--color-purple)] text-[var(--color-white)]" : "bg-[var(--color-grey-750)] text-[var(--color-grey-500)]"}`}
          disabled={!canSubmit}
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}
