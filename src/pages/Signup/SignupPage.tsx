import { useEffect, useState } from "react";
import {
  sendPhoneCode,
  verifyPhoneCode,
  postSignup,
  login,
} from "@/apis/login";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import LeftChevron from "../../assets/icon_left-chevron.svg";
import CheckIcon from "@/assets/check.svg";

export default function SignupPage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { setTokens, setUserInfo } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [kakaoId, setKakaoId] = useState<string | null>(null);
  const [loginKey, setLoginKey] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    // URL 또는 localStorage에서 kakaoId / loginKey / provider를 확보
    const lk = search.get("loginKey") ?? localStorage.getItem("loginKey");
    const pRaw =
      localStorage.getItem("loginProvider") ?? localStorage.getItem("provider");
    const kid = localStorage.getItem("kakaoId");

    const p = pRaw
      ? pRaw.startsWith("kakao-")
        ? pRaw
        : `kakao-${pRaw}`
      : null;

    if (lk) setLoginKey(lk);
    if (p) setProvider(p);
    if (kid) setKakaoId(kid);
  }, [search]);

  // 페이지 진입 시 기존 회원 확인
  useEffect(() => {
    if (!loginKey) return;

    async function checkExistingUser() {
      try {
        // 기존 회원인지 확인 (login API 호출)
        const loginResult = await login(loginKey!);
        console.log("✅ 기존 회원 확인 성공:", loginResult);

        // 토큰과 사용자 정보를 Zustand store와 localStorage에 저장 (각각 존재 여부에 따라)
        setUserInfo({
          kakaoId: loginResult.kakaoId,
          provider: loginResult.provider?.startsWith("kakao-")
            ? loginResult.provider
            : `kakao-${loginResult.provider}`,
        });

        if (loginResult.kakaoId) {
          localStorage.setItem("kakaoId", loginResult.kakaoId);
        }
        if (loginResult.provider) {
          const prov = loginResult.provider.startsWith("kakao-")
            ? loginResult.provider
            : `kakao-${loginResult.provider}`;
          localStorage.setItem("loginProvider", prov);
          localStorage.setItem("provider", prov);
        }
        if (loginResult.accessToken) {
          setTokens({ accessToken: loginResult.accessToken });
          localStorage.setItem("accessToken", loginResult.accessToken);
        }
        if (loginResult.refreshToken) {
          setTokens({ refreshToken: loginResult.refreshToken });
          localStorage.setItem("refreshToken", loginResult.refreshToken);
        }

        // 신규 사용자라면 회원가입 폼 유지 (리다이렉트 금지)
        const isNewUser =
          loginResult?.isNewUser === true ||
          loginResult?.isNewUser === "true" ||
          loginResult?.isNewUser === "Y" ||
          loginResult?.isNewUser === "YES" ||
          loginResult?.isNewUser === "1";
        if (isNewUser) {
          console.log("🆕 신규 사용자이므로 회원가입 페이지에 머뭅니다.");
          return;
        }

        // 기존 회원이므로 provider에 따라 적절한 페이지로 리다이렉트
        const normalizedProvider = loginResult.provider?.startsWith("kakao-")
          ? loginResult.provider
          : `kakao-${loginResult.provider}`;
        const redirectPath =
          normalizedProvider === "kakao-staff"
            ? "/manager/home"
            : "/client/mypage";
        console.log("리다이렉트 확인:", {
          provider: loginResult.provider,
          redirectPath,
        });
        navigate(redirectPath, { replace: true });
      } catch (loginError) {
        console.log("🔍 기존 회원이 아님, 회원가입 폼 표시:", loginError);
        // 기존 회원이 아니므로 회원가입 폼을 그대로 표시
      }
    }

    checkExistingUser();
  }, [loginKey, setTokens, setUserInfo, navigate]);

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
    console.log("🔥 handleSubmit 함수 호출됨!");
    console.log("현재 상태:", {
      kakaoId,
      provider,
      name,
      phone,
      isVerified,
      canSubmit,
    });

    if (!kakaoId || !provider || !name || !phone || !isVerified) {
      console.log("❌ 필수 조건 미충족으로 함수 종료");
      return;
    }

    console.log("✅ 회원가입 API 호출 시작");
    try {
      const normalizedProvider = provider?.startsWith("kakao-")
        ? provider
        : `kakao-${provider}`;
      const result = await postSignup({
        kakaoId,
        provider: normalizedProvider!,
        name,
        contact: phone,
        email: "test@test.com",
      });
      console.log("✅ 회원가입 성공:", result);

      // 회원가입 성공 시 토큰과 사용자 정보 저장 (각 토큰 존재 시 저장)
      setUserInfo({
        kakaoId: result.kakaoId,
        provider: result.provider?.startsWith("kakao-")
          ? result.provider
          : `kakao-${result.provider}`,
      });

      if (result.kakaoId) {
        localStorage.setItem("kakaoId", result.kakaoId);
      }
      if (result.provider) {
        const prov = result.provider.startsWith("kakao-")
          ? result.provider
          : `kakao-${result.provider}`;
        localStorage.setItem("loginProvider", prov);
        localStorage.setItem("provider", prov);
      }
      if (result.accessToken) {
        setTokens({ accessToken: result.accessToken });
        localStorage.setItem("accessToken", result.accessToken);
      }
      if (result.refreshToken) {
        setTokens({ refreshToken: result.refreshToken });
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      const redirectPath =
        (result.provider?.startsWith("kakao-")
          ? result.provider
          : `kakao-${result.provider}`) === "kakao-staff"
          ? "/manager/onboard"
          : "/client/mypage";
      navigate(redirectPath, { replace: true });
    } catch (signupError) {
      console.error("❌ 회원가입 실패:", signupError);

      // 이미 존재하는 사용자인 경우 로그인 처리로 리다이렉트
      const redirectPath =
        provider === "kakao-staff" ? "/manager/home" : "/client/mypage";
      navigate(redirectPath, { replace: true });
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
                className={`body2 w-[243px] rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${isVerified ? "border-[var(--color-purple)] opacity-80" : phone ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                placeholder="연락처를 입력해주세요."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={isVerified}
              />
              <button
                type="button"
                className={`caption1 my-1 ml-3 w-[76px] rounded-[20px] border text-[var(--color-white)] ${phone && !isSent ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : "border-[var(--color-grey-550)]"}`}
                disabled={!phone || isSent || isVerified}
                onClick={handleSendCode}
              >
                번호 인증
              </button>
            </div>
            {isSent && (
              <div className="mb-2 flex gap-2">
                <input
                  className={`body2 w-[243px] rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${isVerified ? "border-[var(--color-purple)] opacity-80" : code ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                  placeholder="인증번호"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={isVerified}
                />
                <button
                  type="button"
                  className={`caption1 my-1 ml-3 flex w-[96px] items-center justify-center gap-1 rounded-[20px] border text-[var(--color-white)] transition-colors ${isVerified ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : code ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : "border-[var(--color-grey-550)]"}`}
                  disabled={!code || isVerified}
                  onClick={handleVerify}
                >
                  {isVerified ? (
                    <>
                      <img
                        src={CheckIcon}
                        alt="인증 완료"
                        className="h-4 w-4"
                      />
                      <span>인증완료</span>
                    </>
                  ) : (
                    <span>확인</span>
                  )}
                </button>
              </div>
            )}
            {isVerified && (
              <div
                className="mb-4 flex items-center gap-2 text-[var(--color-purple)] transition-opacity duration-300"
                aria-live="polite"
              >
                <img src={CheckIcon} alt="인증 완료" className="h-4 w-4" />
                <span className="caption1">휴대폰 인증이 완료되었어요.</span>
              </div>
            )}
          </div>
        </div>
        {/* 하단 버튼 */}
        <button
          onClick={e => {
            console.log("🚀 회원가입 완료 버튼 클릭됨!", {
              canSubmit,
              disabled: !canSubmit,
              event: e,
            });
            handleSubmit();
          }}
          className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] bg-[var(--color-purple)] text-[var(--color-white)] transition-colors duration-200`}
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}
