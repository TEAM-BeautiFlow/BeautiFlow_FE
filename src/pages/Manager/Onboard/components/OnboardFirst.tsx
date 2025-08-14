import check from "@/assets/check.svg";
import bgLeft from "@/assets/Left_W.png";
import bgRight from "@/assets/Right_W.png";
import { useNavigate } from "react-router-dom";

export default function OnboardPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[100dvh] min-w-[375px] flex-col items-center justify-center">
      <div
        className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-x-hidden overflow-y-auto px-5 pt-8 pb-8"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 60%, #1E0C2D 100%)",
        }}
      >
        {/* 실제 컨텐츠 */}
        <img className="z-10 mt-27 h-10 w-10" src={check} alt="check" />
        <div className="h1 z-10 mt-6 mb-2 text-center text-[var(--color-grey-150)]">
          회원가입이 완료되었습니다.
        </div>
        <div className="body1 z-10 mb-6 text-center text-[var(--color-grey-450)]">
          샵 등록 혹은 입사 신청하고,
          <br />
          뷰티플로우를 무료로 이용해 보세요.
        </div>
        {/* 중간 데코레이션: 텍스트와 버튼 사이 */}
        <div className="relative z-0 mb-6 h-[180px] w-full">
          <img
            src={bgLeft}
            alt="bg-left"
            className="absolute top-0 left-0 w-1/2 max-w-[160px] select-none"
          />
          <img
            src={bgRight}
            alt="bg-right"
            className="absolute top-0 right-0 w-1/2 max-w-[160px] select-none"
          />
        </div>

        {/* 버튼 영역 */}
        <button
          onClick={() => navigate("/manager/onboard/shop")}
          className="z-10 mb-4 h-[82px] w-[335px] rounded-xl bg-[var(--color-grey-950)] py-5 pr-4 pl-6 text-left"
        >
          <div className="caption1 text-[var(--color-grey-450)]">
            원장님이신가요?
          </div>
          <div className="label1 flex items-center justify-between text-[var(--color-white)]">
            샵 등록하기
          </div>
        </button>
        <button
          onClick={() => navigate("/manager/onboard/join")}
          className="z-10 mb-4 h-[82px] w-[335px] rounded-xl bg-[var(--color-grey-950)] py-5 pr-4 pl-6 text-left"
        >
          <div className="caption1 text-[var(--color-grey-450)]">
            직원분이신가요?
          </div>
          <div className="label1 flex items-center justify-between text-[var(--color-white)]">
            입사 신청하기
          </div>
        </button>
        {/* 하단 데코레이션: 고정 높이 영역에 배경 이미지 배치 */}
      </div>
    </div>
  );
}
