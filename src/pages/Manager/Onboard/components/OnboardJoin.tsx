import { useState } from "react";

export default function OnboardJoin() {
  const [bizNum, setBizNum] = useState("");

  const isFormValid = bizNum;

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
          <button>
            <img
              src="/src/assets/icon_left-chevron.svg"
              alt="뒤로가기"
              className="h-6 w-6"
            />
          </button>
          <div className="label1 flex-1 text-center text-[var(--color-white)]">
            입사 신청하기
          </div>
        </div>
        {/* 폼 영역 */}
        <form className="flex w-full flex-1 flex-col gap-6">
          {/* 샵 주소 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              사업자등록번호 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="mb-4 flex gap-2">
              <input
                className={`body2 flex-1 rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${bizNum ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                placeholder="사업자등록번호를 입력해주세요."
                value={bizNum}
                onChange={e => setBizNum(e.target.value)}
                required
              />
              <button
                type="button"
                className="caption1 my-1 rounded-[20px] border border-[var(--color-grey-550)] px-4 text-[var(--color-white)]"
                disabled
              >
                샵 검색
              </button>
            </div>
          </div>
          {/* 사업자등록번호 */}
        </form>
        {/* 하단 버튼 */}
        <button
          className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] transition-colors duration-200 ${isFormValid ? "bg-[var(--color-purple)] text-[var(--color-white)]" : "bg-[var(--color-grey-750)] text-[var(--color-grey-500)]"}`}
          disabled={!isFormValid}
        >
          입사 신청하기
        </button>
      </div>
    </div>
  );
}
