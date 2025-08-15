import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Home,
  User,
  MessageSquare,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
// 🔽 1. 일관성을 위해 api 인스턴스를 import 합니다.
import api from "@/apis/axiosInstance"; // 실제 파일 경로에 맞게 수정해주세요.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

// ❌ 2. 하드코딩된 API 관련 상수를 모두 제거합니다.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ACCESS_TOKEN = "eyJhbGciOi...LEo";

const OwnerSalesPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const [depositAmount, setDepositAmount] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_LENGTH = 50;

  useEffect(() => {
    const fetchSalesInfo = async () => {
      if (!shopId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 🔽 3. api 인스턴스를 사용하여 GET 요청을 보냅니다.
        const response = await api.get(`/shops/manage/${shopId}`);

        if (response.data && response.data.data) {
          const data = response.data.data;
          const depositValue =
            data.depositAmount ||
            data.deposit_amount ||
            data.depositPrice ||
            data.deposit_price ||
            data.reservationDeposit ||
            data.reservation_deposit ||
            0;
          const accountValue =
            data.accountHolder ||
            data.account_holder ||
            data.accountInfo ||
            data.account_info ||
            data.bankAccount ||
            data.bank_account ||
            "";

          setDepositAmount(depositValue ? String(depositValue) : "");
          setAccountHolder(accountValue || "");
        }
      } catch (error) {
        console.error("매출 관리 정보 로딩 실패:", error);
        setError("기존 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesInfo();
  }, [shopId]);

  const handleSave = async () => {
    if (!shopId) return;

    if (!depositAmount.trim()) {
      alert("예약금액을 입력해주세요.");
      return;
    }

    if (!accountHolder.trim()) {
      alert("입금처를 입력해주세요.");
      return;
    }

    const requestDto = {
      depositPrice: depositAmount ? parseInt(depositAmount, 10) : 0,
      accountHolder: accountHolder.trim(),
    };

    const formData = new FormData();
    // 백엔드 API 명세에 따라 Blob으로 감싸지 않고 바로 JSON 문자열을 추가합니다.
    // 대부분의 경우 이 방식이 더 일반적입니다.
    formData.append("requestDto", JSON.stringify(requestDto));

    try {
      // 🔽 4. api 인스턴스를 사용하여 PATCH 요청을 보냅니다.
      await api.patch(`/shops/manage/${shopId}`, formData);

      alert("매출 관리 정보가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (error: unknown) {
      console.error("매출 관리 정보 저장 실패:", error);
      if (error && typeof error === "object" && "response" in error) {
        console.error("에러 응답:", (error as any).response?.data);
      }
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
        }}
      >
        <div>기존 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mx-auto flex min-h-screen max-w-sm items-center justify-center"
        style={{
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
        }}
      >
        <div>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "var(--color-light-purple)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* Status Bar (이하 JSX 부분은 수정사항 없음) */}
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
          padding: "0 20px 24px",
          marginTop: "8px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={24} color="var(--color-white)" />
        </button>
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
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: "0 20px 32px" }}>
        {/* 예약금액 입력 필드 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="depositPrice"
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
              id="depositPrice"
              type="text"
              placeholder="예약금액을 입력해주세요"
              value={depositAmount}
              onChange={e =>
                setDepositAmount(e.target.value.replace(/[^0-9]/g, ""))
              }
              maxLength={MAX_LENGTH}
              className="body2"
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
              {depositAmount.length}/{MAX_LENGTH}
            </span>
          </div>
          {depositAmount && (
            <p
              className="caption2"
              style={{ color: "var(--color-light-purple)", marginTop: "4px" }}
            >
              현재 설정: {parseInt(depositAmount).toLocaleString()}원
            </p>
          )}
        </div>

        {/* 입금처 입력 필드 */}
        <div style={{ marginBottom: "32px" }}>
          <label
            htmlFor="accountInfo"
            className="label1"
            style={{
              color: "var(--color-white)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            입금처 <span style={{ color: "var(--color-status-red)" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="accountInfo"
              type="text"
              placeholder="예약금을 받을 계좌를 입력해주세요"
              value={accountHolder}
              onChange={e => setAccountHolder(e.target.value)}
              maxLength={MAX_LENGTH}
              className="body2"
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
              {accountHolder.length}/{MAX_LENGTH}
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
