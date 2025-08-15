import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
} from "lucide-react";
import api from "@/apis/axiosInstance";
import ManagerNavbar from "@/layout/ManagerNavbar"; // 🔽 ManagerNavbar를 import 합니다.
import "../../styles/color-system.css";
import "../../styles/type-system.css";

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
    formData.append("requestDto", JSON.stringify(requestDto));

    try {
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 20px 24px",
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
      {/* 🔽 pb-28 추가하여 네비게이션 바 공간 확보 */}
      <div style={{ padding: "0 20px 110px" }}>
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

      <ManagerNavbar />
    </div>
  );
};

export default OwnerSalesPage;
