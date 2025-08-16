import Logo from "../assets/main_beautiflow2.svg";
import KakaoIcon from "../assets/kakao_icon.png";
import MainLogo from "../assets/FINAL_BEAUTIFLOW_SYMBOL.svg";
import MainBg from "../assets/main_bg.png";
import { getKakaoAuthUrl } from "@/apis/login";

export default function MainPage() {
  // no router hooks used here to avoid runtime errors if route context is missing

  function handleKakaoLogin() {
    try {
      localStorage.setItem("loginProvider", "kakao-customer");
    } catch {}
    const url = getKakaoAuthUrl("customer");
    window.location.href = url;
  }

  function handleStaffLogin() {
    try {
      localStorage.setItem("loginProvider", "kakao-staff");
    } catch {}
    const url = getKakaoAuthUrl("staff");
    window.location.href = url;
  }

  return (
    <main className="min-h-dvh min-w-0 bg-neutral-900 text-white">
      <div
        className="relative mx-auto min-h-dvh w-full max-w-[375px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${MainBg})` }}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex min-h-dvh flex-col justify-between">
          {/* 상단 여백 및 브랜드 영역 */}
          <div className="px-6 pt-32">
            <div className="h-20 w-20 overflow-hidden rounded-2xl">
              <img
                src={MainLogo}
                alt="BEAUTIFLOW"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="mt-6 text-base text-neutral-300">
              당신의 뷰티샵에 필요한 모든 흐름,
            </p>

            <img src={Logo} alt="BEAUTIFLOW" className="mt-4 h-10 w-60" />
          </div>

          {/* 액션 영역 */}
          <div className="px-6 pb-10">
            <button
              onClick={handleKakaoLogin}
              className="relative flex h-14 w-full items-center justify-center rounded-xl bg-[#FEE500] text-center text-base font-semibold text-neutral-900"
            >
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full">
                  <img src={KakaoIcon} alt="" className="h-6 w-6" />
                </span>
              </span>
              카카오 로그인
            </button>

            <button
              type="button"
              onClick={handleStaffLogin}
              className="mt-8 w-full text-center text-sm text-neutral-300 underline underline-offset-4"
            >
              관리자 계정으로 로그인
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
