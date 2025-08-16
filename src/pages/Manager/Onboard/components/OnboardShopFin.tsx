import check from "@/assets/check.svg";
import bgLeft from "@/assets/Left_W.png";
import bgRight from "@/assets/Right_W.png";
import arrowRight from "@/assets/icon_right-chevron.svg";
import { useNavigate } from "react-router-dom";

export default function OnboardShopFin() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[100dvh] min-w-[375px] flex-col items-center">
      <div
        className="relative flex min-h-[100dvh] w-full max-w-[375px] flex-col items-center overflow-x-hidden overflow-y-auto px-5 pt-8 pb-8"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 60%, #1E0C2D 100%)",
        }}
      >
        {/* 실제 컨텐츠 */}
        <img className="z-10 mt-27 h-10 w-10" src={check} alt="check" />
        <div className="h1 z-10 mt-6 mb-2 text-center text-[var(--color-grey-150)]">
          샵 생성이 완료되었습니다.
        </div>
        <div className="body1 z-10 mb-6 text-center text-[var(--color-grey-450)]">
          사업자등록증을 업로드해야
          <br />
          뷰티플로우를 계속 사용할 수 있어요.
        </div>
        {/* 중간 데코 */}
        <div className="relative z-0 mb-6 h-[160px] w-full">
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
        <button className="z-10 mb-4 flex h-[82px] w-[335px] flex-row justify-between rounded-xl bg-[var(--color-grey-950)] py-5 pr-4 pl-6 text-left">
          <div className="label1 flex items-center justify-between text-[var(--color-white)]">
            사업자등록 인증하기
          </div>
          <img src={arrowRight} alt="arrow-right" />
        </button>
        <button
          onClick={() => navigate("/manager/mypage")}
          className="z-10 mb-4 flex h-[82px] w-[335px] flex-row justify-between rounded-xl bg-[var(--color-grey-950)] py-5 pr-4 pl-6 text-left"
        >
          <div className="label1 flex items-center justify-between text-[var(--color-white)]">
            일단 둘러보기
          </div>
          <img src={arrowRight} alt="arrow-right" />
        </button>
      </div>
    </div>
  );
}
