import check from "@/assets/check.svg";
import bgLeft from "@/assets/Left_W.png";
import bgRight from "@/assets/Right_W.png";

export default function OnboardJoinFin() {
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
          회원가입이 완료되었습니다.
        </div>
        <div className="body1 z-10 mb-76 text-center text-[var(--color-grey-450)]">
          뷰티플로우 인스타그램을 팔로우하고
          <br />더 많은 소식을 받아보세요.
        </div>
        {/* 버튼 영역 */}
        <button className="mb-2 flex h-[56px] w-[335px] flex-col items-center justify-center rounded-[4px] bg-[var(--color-purple)]">
          <div className="label1 flex items-center justify-center text-[var(--color-white)]">
            인스타그램 구경하기
          </div>
        </button>
        <button className="mb-4 flex h-[56px] w-[335px] flex-col items-center justify-center rounded-[4px]">
          <div className="label1 flex items-center justify-center text-[var(--color-grey-550)]">
            나중에 할게요
          </div>
        </button>
      </div>
    </div>
  );
}
