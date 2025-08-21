import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgLeft from "@/assets/Left_W.png";
import bgRight from "@/assets/Right_W.png";
import { checkShopExists, applyShop } from "@/apis/login";
import LeftChevron from "@/assets/icon_left-chevron.svg";

export default function OnboardJoin() {
  const navigate = useNavigate();
  const [bizNum, setBizNum] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [shopId, setShopId] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "idle" | "success" | "not_found" | "error";
    message?: string;
    shopName?: string;
  }>({ type: "idle" });

  async function handleSearchShop() {
    if (!bizNum || isChecking) return;
    setIsChecking(true);
    try {
      const result = await checkShopExists(bizNum);
      if (result?.exists && result?.shop?.id != null) {
        setShopId(result.shop.id);
        const shop: any = (result as any)?.shop;
        const name = shop?.name ?? shop?.shopName;
        setFeedback({
          type: "success",
          message: "샵을 찾았어요.",
          shopName: name,
        });
      } else {
        setShopId(null);
        setFeedback({
          type: "not_found",
          message: "해당 사업자등록번호의 샵을 찾을 수 없습니다.",
        });
      }
    } catch (e) {
      setShopId(null);
      setFeedback({
        type: "error",
        message: "샵 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsChecking(false);
    }
  }

  async function handleApply() {
    if (!shopId) {
      return;
    }
    try {
      setIsApplying(true);
      await applyShop(shopId);
      navigate("/manager/onboard/join/fin", { replace: true });
    } catch (e) {
      setFeedback({
        type: "error",
        message: "입사 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] min-w-[375px] flex-col items-center">
      <div
        className="relative flex min-h-[100dvh] w-full max-w-[375px] flex-col"
        style={{
          background: "linear-gradient(180deg, #1A1A1A 60%, #1E0C2D 100%)",
        }}
      >
        {/* 배경 이미지 */}
        <img
          src={bgLeft}
          alt="bg-left"
          className="pointer-events-none absolute bottom-100 left-0 w-1/2 max-w-[160px] select-none"
          style={{ zIndex: 0 }}
        />
        <img
          src={bgRight}
          alt="bg-right"
          className="pointer-events-none absolute right-0 bottom-115 w-1/2 max-w-[160px] select-none"
          style={{ zIndex: 0 }}
        />
        {/* 상단 네비게이션 */}
        <div className="z-10 mb-8 flex w-full items-center px-5 pt-8">
          <button onClick={() => navigate(-1)} aria-label="뒤로가기">
            <img src={LeftChevron} alt="뒤로가기" className="h-6 w-6" />
          </button>
          <div className="label1 flex-1 text-center text-[var(--color-white)]">
            입사 신청하기
          </div>
        </div>
        {/* 폼 영역 */}
        <div className="z-10 flex w-full flex-1 flex-col gap-6 px-5">
          {/* 사업자등록번호 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              사업자등록번호 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="mb-4 flex gap-2">
              <input
                className={`body2 flex-1 rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${
                  feedback.type === "not_found" || feedback.type === "error"
                    ? "border-[#D2636A]"
                    : bizNum
                      ? "border-[var(--color-purple)]"
                      : "border-[var(--color-grey-650)]"
                }`}
                placeholder="사업자등록번호를 입력해주세요."
                value={bizNum}
                onChange={e => {
                  setBizNum(e.target.value);
                  setShopId(null);
                  if (feedback.type !== "idle") setFeedback({ type: "idle" });
                }}
                required
              />
              <button
                type="button"
                className={`caption1 my-1 rounded-[20px] border px-4 text-[var(--color-white)] ${
                  bizNum && !isChecking
                    ? "border-[var(--color-purple)] bg-[var(--color-purple)]"
                    : "border-[var(--color-grey-550)]"
                } ${isChecking ? "opacity-70" : ""}`}
                disabled={!bizNum || isChecking}
                onClick={handleSearchShop}
              >
                {isChecking ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-[var(--color-white)]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    검색 중...
                  </span>
                ) : (
                  "샵 검색"
                )}
              </button>
            </div>
            {feedback.type !== "idle" && (
              <div
                className={`mt-2 rounded-[6px] px-3 py-3 ${
                  feedback.type === "success"
                    ? "border border-[var(--color-purple)] bg-[var(--color-grey-950)] text-[var(--color-white)]"
                    : "border border-[#D2636A] bg-[#2A1C22] text-[#FAD1D4]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedback.type === "success" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#A465FD" />
                      <path
                        d="M8 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#D2636A" />
                      <path
                        d="M12 8v5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="16" r="1" fill="white" />
                    </svg>
                  )}
                  <div className="caption1">
                    {feedback.message}
                    {feedback.type === "success" && feedback.shopName && (
                      <span className="ml-1 text-[var(--color-grey-350)]">
                        ({feedback.shopName})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="w-full px-5 pb-50">
          <button
            onClick={handleApply}
            className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] bg-[var(--color-purple)] text-[var(--color-white)] transition-colors duration-200 ${!shopId || isApplying ? "opacity-70" : ""}`}
            disabled={!shopId || isApplying}
          >
            {isApplying ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-[var(--color-white)]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                신청 중...
              </span>
            ) : (
              "입사 신청하기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
