import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createShop } from "@/apis/login";
import LeftChevron from "../../../../assets/icon_left-chevron.svg";

export default function OnboardShopRegister() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopAddressDetail, setShopAddressDetail] = useState("");
  const [bizNum, setBizNum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = shopName && shopAddress && shopAddressDetail && bizNum;

  async function handleCreateShop() {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const address = `${shopAddress} ${shopAddressDetail}`.trim();
      await createShop({
        name: shopName,
        address,
        businessRegistrationNumber: bizNum,
      });
      navigate("/manager/onboard/shop/fin", { replace: true });
    } catch (e) {
      // 실패 시 별도 검증 없이 조용히 유지
      // 필요 시 오류 표시 추가 가능
    } finally {
      setIsSubmitting(false);
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
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex w-full items-center px-5 pt-8">
          <button
            className="mr-2"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <LeftChevron />
          </button>
          <div className="label1 flex-1 text-center text-[var(--color-white)]">
            샵 등록하기
          </div>
        </div>
        {/* 폼 영역 */}
        <form className="flex w-full flex-1 flex-col gap-6 px-5">
          {/* 샵 이름 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              샵 이름 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <input
              className={`body2 w-full rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${shopName ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
              placeholder="샵 이름을 입력해주세요."
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              required
            />
          </div>
          {/* 샵 주소 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              샵 주소 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="mb-4 flex gap-2">
              <input
                className={`body2 flex-1 rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${shopAddress ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                placeholder="샵 주소를 입력해주세요."
                value={shopAddress}
                onChange={e => setShopAddress(e.target.value)}
                required
              />
              <button
                type="button"
                className="caption1 my-1 rounded-[20px] border border-[var(--color-grey-550)] px-4 text-[var(--color-white)]"
                disabled
              >
                주소 검색
              </button>
            </div>
            <input
              className={`body1 w-full rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${shopAddressDetail ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
              placeholder="(필수) 상세 주소를 입력해주세요."
              value={shopAddressDetail}
              onChange={e => setShopAddressDetail(e.target.value)}
              required
            />
          </div>
          {/* 사업자등록번호 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              사업자등록번호 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <input
              className={`body1 w-full rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${bizNum ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
              placeholder="사업자등록번호를 입력해주세요."
              value={bizNum}
              onChange={e => setBizNum(e.target.value)}
              required
            />
          </div>
        </form>
        {/* 하단 버튼 */}
        <div className="w-full px-5 pb-40">
          <button
            onClick={handleCreateShop}
            className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] transition-colors duration-200 ${isFormValid && !isSubmitting ? "bg-[var(--color-purple)] text-[var(--color-white)]" : "bg-[var(--color-grey-750)] text-[var(--color-grey-500)]"}`}
            disabled={!isFormValid || isSubmitting}
          >
            샵 생성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
