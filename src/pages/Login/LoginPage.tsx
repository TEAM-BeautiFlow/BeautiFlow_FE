import Logo from "../../assets/Logo.svg";
import ChatIcon from "../../assets/message-text-02.svg";

export default function LoginPage() {
  // no router hooks used here to avoid runtime errors if route context is missing

  function handleKakaoLogin() {
    // TODO: 카카오 로그인 연동 포인트
  }

  return (
    <main className="min-h-dvh min-w-0 bg-neutral-900 text-white">
      <div className="flex min-h-dvh flex-col justify-between">
        {/* 상단 여백 및 브랜드 영역 */}
        <div className="px-6 pt-32">
          <div className="h-16 w-16 rounded-2xl bg-purple-500" />

          <p className="mt-6 text-base text-neutral-300">
            당신의 뷰티샵에 필요한 모든 흐름,
          </p>

          <img src={Logo} alt="BEAUTIFLOW" className="mt-4 h-10 w-auto" />
        </div>

        {/* 액션 영역 */}
        <div className="px-6 pb-10">
          <button
            onClick={handleKakaoLogin}
            className="relative flex h-14 w-full items-center justify-center rounded-xl bg-[#FEE500] text-center text-base font-semibold text-neutral-900"
          >
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <img src={ChatIcon} alt="" className="h-4 w-4 invert" />
              </span>
            </span>
            카카오 로그인
          </button>

          <button
            type="button"
            onClick={() => {}}
            className="mt-8 w-full text-center text-sm text-neutral-300"
          >
            관리자 계정으로 로그인
          </button>
        </div>
      </div>
    </main>
  );
}
