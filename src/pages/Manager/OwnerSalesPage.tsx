import { useState } from "react";
import {
  ChevronLeft,
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import "../../styles/color-system.css"; // 색상 시스템 임포트
import "../../styles/type-system.css"; // 타입 시스템 임포트

const OwnerSalesPage = () => {
  const [reservationAmount, setReservationAmount] = useState("");
  const [depositorName, setDepositorName] = useState("");

  const MAX_LENGTH_AMOUNT = 50; // Figma에 0/50으로 표시됨 (예시)
  const MAX_LENGTH_DEPOSITOR = 50; // Figma에 0/50으로 표시됨 (예시)

  const handleSave = () => {
    console.log("매출 관리 저장:", { reservationAmount, depositorName });
    // 여기에 실제 저장 로직 (API 호출 등)을 구현합니다.
  };

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif", // Pretendard 폰트 적용
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
            <div
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            ></div>
          </div>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <rect
              x="1"
              y="3"
              width="18"
              height="6"
              rx="2"
              stroke="white"
              strokeWidth="1"
            />
            <rect x="20" y="4" width="2" height="4" rx="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px 24px", // Figma에 맞춰 패딩 조정
          marginTop: "8px", // Figma에 맞춰 마진 조정
        }}
      >
        <ChevronLeft size={24} color="var(--color-white)" />
        <h1
          className="title1"
          style={{ color: "var(--color-white)", margin: 0 }}
        >
          매출 관리
        </h1>
        <button
          className="label1"
          style={{
            color: "var(--color-light-purple)",
            fontWeight: "var(--font-weight-semibold)",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {" "}
        {/* Figma에 맞춰 패딩 조정 */}
        {/* 예약금액 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="reservationAmount"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            예약금액 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="reservationAmount"
              type="text"
              placeholder="예약금액을 입력해주세요"
              value={reservationAmount}
              onChange={e => setReservationAmount(e.target.value)}
              maxLength={MAX_LENGTH_AMOUNT}
              style={{
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontSize: "14px",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
              }}
            />
            <span
              className="caption2"
              style={{
                position: "absolute",
                bottom: "12px",
                right: "16px",
                color: "var(--color-grey-450)",
              }}
            >
              {reservationAmount.length}/{MAX_LENGTH_AMOUNT}
            </span>
          </div>
        </div>
        {/* 입금자명 입력 필드 */}
        <div style={{ marginBottom: "32px" }}>
          {" "}
          {/* Figma에 맞춰 마진 조정 */}
          <label
            htmlFor="depositorName"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            입금자명 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="depositorName"
              type="text"
              placeholder="예약금을 받을 계좌를 입력해주세요"
              value={depositorName}
              onChange={e => setDepositorName(e.target.value)}
              maxLength={MAX_LENGTH_DEPOSITOR}
              style={{
                width: "100%",
                backgroundColor: "var(--color-grey-850)",
                border: "1px solid var(--color-grey-750)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--color-white)",
                fontSize: "14px",
                fontFamily: "Pretendard, sans-serif",
                outline: "none",
              }}
            />
            <span
              className="caption2"
              style={{
                position: "absolute",
                bottom: "12px",
                right: "16px",
                color: "var(--color-grey-450)",
              }}
            >
              {depositorName.length}/{MAX_LENGTH_DEPOSITOR}
            </span>
          </div>
          <p
            className="caption2"
            style={{ color: "var(--color-grey-450)", marginTop: "8px" }}
          >
            ex) 국민 110-249-249383 손하늘
          </p>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-sm items-center justify-around py-3"
        style={{
          backgroundColor: "var(--color-black)",
          borderTop: "1px solid var(--color-grey-850)",
        }}
      >
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <Calendar size={24} />
          예약
        </button>
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <User size={24} />
          고객
        </button>
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <MessageSquare size={24} />
          채팅
        </button>
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-light-purple)" }}
        >
          <Home size={24} />
          매장
        </button>
        <button
          className="flex flex-col items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-grey-450)" }}
        >
          <MoreHorizontal size={24} />
          더보기
        </button>
      </nav>
    </div>
  );
};

export default OwnerSalesPage;
