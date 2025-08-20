import check from "@/assets/check.svg";
import bgLeft from "@/assets/Left_W.png";
import bgRight from "@/assets/Right_W.png";
import { useNavigate } from "react-router-dom";

export default function OnboardPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[100dvh] min-w-[375px] flex-col items-center justify-center">
      <div
        className="relative flex w-full max-w-[375px] flex-grow flex-col items-center overflow-x-hidden overflow-y-auto pt-8 pb-8"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 60%, #1E0C2D 100%)",
        }}
      >
        {/* 실제 컨텐츠 */}
        <img className="z-10 mt-27 h-10 w-10" src={check} alt="check" />
        <div className="h1 z-10 mt-6 mb-2 text-center text-[var(--color-grey-150)]">
          예약이 완료되었어요.{" "}
        </div>
        <div className="body1 z-10 mb-6 text-center text-[var(--color-grey-450)]">
          예약이 확정되면 알려드릴게요.
        </div>
        {/* 중간 데코레이션: 텍스트와 버튼 사이 */}
        <div className="relative z-0 mb-6 h-[180px] w-full">
          <img
            src={bgLeft}
            alt="bg-left"
            className="absolute top-16 left-0 w-1/2 max-w-[160px] select-none"
          />
          <img
            src={bgRight}
            alt="bg-right"
            className="absolute top-0 right-0 w-1/2 max-w-[160px] select-none"
          />
        </div>

        {/* 버튼 영역 */}
        <button
          onClick={() => navigate("/reservations")}
          className="z-10 mt-60 h-[52px] w-[335px] items-center rounded-[4px] bg-[var(--color-purple)]"
        >
          <div className="label1 text-white">예약 상세내역 보기</div>
        </button>
        <button onClick={() => navigate("/")} className="z-10 py-5">
          <div className="label1 items-center text-[var(--color-grey-550)]">
            그냥 둘러볼게요
          </div>
        </button>
        {/* 하단 데코레이션: 고정 높이 영역에 배경 이미지 배치 */}
      </div>
    </div>
  );
}
