import check from "@/assets/check.svg";
import bgLeft from "@/assets/Left_W.png";
import bgRight from "@/assets/Right_W.png";
import { useNavigate } from "react-router-dom";

export default function OnboardJoinFin() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[812px] min-w-[375px] flex-col items-center justify-center">
      <div
        className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 60%, #1E0C2D 100%)",
        }}
      >
        {/* 배경 이미지: 카드 내부에만 */}
        <img
          src={bgLeft}
          alt="bg-left"
          className="pointer-events-none absolute bottom-85 left-0 w-1/2 max-w-[160px] select-none"
          style={{ zIndex: 0 }}
        />
        <img
          src={bgRight}
          alt="bg-right"
          className="pointer-events-none absolute right-0 bottom-105 w-1/2 max-w-[160px] select-none"
          style={{ zIndex: 0 }}
        />
        {/* 실제 컨텐츠 */}
        <img className="z-10 mt-27 h-10 w-10" src={check} alt="check" />
        <div className="h1 z-10 mt-6 mb-2 text-center text-[var(--color-grey-150)]">
          입사 신청이 완료되었습니다.
        </div>
        <div className="body1 z-10 mb-76 text-center text-[var(--color-grey-450)]">
          입사 신청이 승인되면
          <br />
          해당 샵의 시술자로 로그인할 수 있어요.
        </div>
        {/* 버튼 영역 */}
        <button
          onClick={() => navigate("/manager/mypage")}
          className="mb-4 flex h-[56px] w-[335px] flex-row items-center justify-center rounded-[4px] bg-[var(--color-purple)]"
        >
          <div className="label1 flex items-center justify-center text-[var(--color-white)]">
            마이페이지로 이동
          </div>
        </button>
      </div>
    </div>
  );
}
