import { useState } from "react";

export default function SignupPage() {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopAddressDetail, setShopAddressDetail] = useState("");
  const [bizNum, setBizNum] = useState("");
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const isFormValid = shopName && shopAddress && shopAddressDetail && bizNum;

  const handleSendVerificationCode = () => {
    if (shopAddress) {
      setShowVerificationCode(true);
      setIsVerificationSent(true);
    }
  };

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
          <button className="mr-2">
            <img
              src="/src/assets/icon_left-chevron.svg"
              alt="뒤로가기"
              className="h-6 w-6"
            />
          </button>
          <div className="label1 flex-1 text-center text-[var(--color-white)]">
            회원가입
          </div>
        </div>
        {/* 폼 영역 */}
        <form className="flex w-full flex-1 flex-col gap-6">
          {/* 샵 이름 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              이름 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="body2 mb-2 text-[var(--color-grey-550)]">
              고객의 예약 리스트에 노출할 이름을 적어주세요.
            </div>
            <input
              className={`body2 w-full rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${shopName ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
              placeholder="이름을 입력해주세요."
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              required
            />
          </div>
          {/* 샵 주소 */}
          <div>
            <label className="label1 mb-2 flex items-center text-[var(--color-white)]">
              휴대폰 인증 <span className="ml-1 text-[#D2636A]">*</span>
            </label>
            <div className="body2 mb-2 text-[var(--color-grey-550)]">
              하이픈 (-)을 제외하고 숫자만 입력해주세요.
            </div>
            <div className="mb-4 flex gap-2">
              <input
                className={`body2 w-[243px] rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${shopAddress ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                placeholder="연락처를 입력해주세요."
                value={shopAddress}
                onChange={e => setShopAddress(e.target.value)}
                required
              />
              <button
                type="button"
                className={`caption1 my-1 ml-3 w-[76px] rounded-[20px] border text-[var(--color-white)] ${shopAddress && !isVerificationSent ? "border-[var(--color-purple)] bg-[var(--color-purple)]" : "border-[var(--color-grey-550)]"}`}
                disabled={!shopAddress || isVerificationSent}
                onClick={handleSendVerificationCode}
              >
                번호 인증
              </button>
            </div>
            {showVerificationCode && (
              <div className="mb-4 flex gap-2">
                <input
                  className={`body2 w-[243px] rounded-[4px] border bg-[var(--color-grey-950)] px-4 py-4 text-[var(--color-white)] focus:outline-none ${verificationCode ? "border-[var(--color-purple)]" : "border-[var(--color-grey-650)]"}`}
                  placeholder="인증번호"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="caption1 my-1 ml-3 w-[76px] rounded-[20px] border border-[var(--color-grey-550)] text-[var(--color-white)]"
                  disabled
                >
                  재전송
                </button>
              </div>
            )}
          </div>
        </form>
        {/* 하단 버튼 */}
        <button
          className={`label1 h-[56px] w-full max-w-[335px] rounded-[4px] transition-colors duration-200 ${isFormValid ? "bg-[var(--color-purple)] text-[var(--color-white)]" : "bg-[var(--color-grey-750)] text-[var(--color-grey-500)]"}`}
          disabled={!isFormValid}
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}
