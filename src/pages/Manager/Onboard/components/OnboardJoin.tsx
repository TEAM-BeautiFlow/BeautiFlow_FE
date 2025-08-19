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

  async function handleSearchShop() {
    if (!bizNum || isChecking) return;
    setIsChecking(true);
    try {
      const result = await checkShopExists(bizNum);
      if (result?.exists && result?.shop?.id != null) {
        setShopId(result.shop.id);
      } else {
        setShopId(null);
        alert("해당 사업자등록번호의 샵을 찾을 수 없습니다.");
      }
    } catch (e) {
      setShopId(null);
      alert("샵 조회 중 오류가 발생했습니다.");
    } finally {
      setIsChecking(false);
    }
  }

  async function handleApply() {
    if (!shopId) {
      alert("먼저 샵 검색을 진행해주세요.");
      return;
    }
    try {
      await applyShop(shopId);
      navigate("/manager/onboard/join/fin", { replace: true });
    } catch (e) {
      alert("입사 신청 중 오류가 발생했습니다.");
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
            <LeftChevron />
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
                className={`body2 flex-1 rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${bizNum ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                placeholder="사업자등록번호를 입력해주세요."
                value={bizNum}
                onChange={e => setBizNum(e.target.value)}
                required
              />
              <button
                type="button"
                className={`caption1 my-1 rounded-[20px] border px-4 text-[var(--color-white)] ${bizNum && !isChecking ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : "border-[var(--color-grey-550)]"}`}
                disabled={!bizNum || isChecking}
                onClick={handleSearchShop}
              >
                샵 검색
              </button>
            </div>
            {shopId && (
              <div className="caption1 text-[var(--color-grey-400)]">
                검색된 샵 ID: {shopId}
              </div>
            )}
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="w-full px-5 pb-50">
          <button
            onClick={handleApply}
            className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] bg-[var(--color-purple)] text-[var(--color-white)] transition-colors duration-200`}
            disabled={!shopId}
          >
            입사 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
