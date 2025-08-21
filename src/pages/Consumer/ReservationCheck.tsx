import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, X, Copy } from "lucide-react";
import api from "@/apis/axiosInstance";
import "../../styles/color-system.css";
import "../../styles/type-system.css";
import type { ApiResponse, MyReservationInfo } from "../../types/api";

const formatDateTimeDuration = (
  dateStr: string,
  timeStr: string,
  minutes: number,
) => {
  if (!dateStr || !timeStr) return "";
  const date = dateStr.replace(/-/g, ".");
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let duration = "";
  if (h > 0) duration += `${h}시간 `;
  if (m > 0) duration += `${m}분`;
  return `${date} ${timeStr} | ${duration.trim()}`;
};

const ReservationCheck = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  const [bookingInfo, setBookingInfo] = useState<MyReservationInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBookingInfo = async () => {
      if (!shopId) {
        setError("매장 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse<MyReservationInfo>>(
          `/reservations/shops/${shopId}/my-reserv-info`,
        );
        if (response.data.success && response.data.data) {
          setBookingInfo(response.data.data);
        } else {
          setError(response.data.message || "정보 로딩 실패");
        }
      } catch (err) {
        setError("정보를 불러오는 중 오류 발생");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingInfo();
  }, [shopId]);

  const handleCopy = () => {
    if (!bookingInfo?.shopAccountInfo) return;
    const accountHolder = bookingInfo.shopAccountInfo.accountHolder;
    const textArea = document.createElement("textarea");
    textArea.value = accountHolder;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(textArea);
  };

  const handleFinalizeReservation = async () => {
    if (!shopId) {
      alert("매장 ID가 없어 요청을 보낼 수 없습니다.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      const requestData = {
        saveFinalReservation: true,
      };
      formData.append("request", JSON.stringify(requestData));

      const response = await api.post(
        `/reservations/${shopId}/process`,
        formData,
      );

      if (response.data.success) {
        alert("예약이 확정되었습니다!");
        navigate(`/reservation-complete`);
      } else {
        setError(response.data.message || "예약 확정에 실패했습니다.");
        alert(`오류: ${response.data.message || "예약 확정에 실패했습니다."}`);
      }
    } catch (err) {
      const errorMessage =
        "예약 확정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black text-white">
        로딩 중...
      </div>
    );
  if (error && !bookingInfo)
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black p-4 text-center text-white">
        오류가 발생했습니다:
        <br />
        {error}
      </div>
    );
  if (!bookingInfo)
    return (
      <div className="mx-auto flex min-h-screen max-w-sm items-center justify-center bg-black text-white">
        예약 정보가 없습니다.
      </div>
    );

  const {
    payInfo,
    reservationDate,
    startTime,
    durationMinutes,
    customerName,
    shopAccountInfo,
  } = bookingInfo;

  const payInfoItems = Object.entries(payInfo || {});
  const totalAmount = payInfoItems.reduce((sum, [, price]) => sum + price, 0);
  const amountToPayNow = bookingInfo.deposit || 0;
  const amountToPayAtShop = totalAmount - amountToPayNow;

  const reservationLabel = payInfoItems.length > 0 ? payInfoItems[0][0] : "예약 내역";

  return (
    <div
      className="mx-auto min-h-screen max-w-sm"
      style={{
        backgroundColor: "var(--color-black)",
        color: "var(--color-white)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          paddingTop: "30px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-0 bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="title1">시술 예약하기</h1>
        <button
          onClick={() => navigate("/")}
          className="p-0 bg-transparent border-none cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <div
        style={{
          padding: "0 20px",
          overflowY: "auto",
          height: "calc(100vh - 160px)",
          paddingBottom: "20px",
        }}
      >
        {/* 결제 금액 */}
        <div style={{ marginBottom: "32px" }}>
          <h2 className="label1" style={{ marginBottom: "16px" }}>
            결제 금액
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <p className="label1" style={{ marginBottom: "4px" }}>
              {reservationLabel}
            </p>
            <p className="caption2" style={{ color: "var(--color-grey-450)" }}>
              {formatDateTimeDuration(
                reservationDate,
                startTime,
                durationMinutes,
              )}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--color-grey-850)",
              borderRadius: "8px",
            }}
          >
            {payInfoItems.map(([label, price]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: "1px solid var(--color-grey-750)",
                }}
              >
                <div
                  className="body2"
                  style={{ color: "var(--color-grey-450)" }}
                >
                  {label}
                </div>
                <div className="body2">{price.toLocaleString()}원</div>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
              }}
            >
              <div
                className="body2"
                style={{ color: "var(--color-light-purple)" }}
              >
                예약금액
              </div>
              <div
                className="body2"
                style={{ color: "var(--color-light-purple)" }}
              >
                - {amountToPayNow.toLocaleString()}원
              </div>
            </div>
          </div>
        </div>

        {/* 매장에서 결제할 금액 */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span className="label1">매장에서 결제할 금액</span>
            <span className="label1">
              {amountToPayAtShop.toLocaleString()}원
            </span>
          </div>
          <p className="caption2" style={{ color: "var(--color-grey-650)" }}>
            <span style={{ color: "var(--color-purple)", marginRight: "4px" }}>
              ⓘ
            </span>{" "}
            방문 후 상담을 통해 변경될 수 있습니다.
          </p>
        </div>

        {/* 지금 결제할 금액 */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="label1">지금 결제할 금액</span>
            <span className="h1" style={{ color: "var(--color-light-purple)" }}>
              {amountToPayNow.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 결제 정보 */}
        <div style={{ marginBottom: "32px" }}>
          <h2 className="label1" style={{ marginBottom: "8px" }}>
            결제 정보
          </h2>
          <p
            className="body2"
            style={{
              color: "var(--color-light-purple)",
              marginBottom: "16px",
              lineHeight: "1.5",
            }}
          >
            입금자명과 가입시 작성한 이름을 일치시켜주세요.
            <br />
            현재 설정 닉네임 :{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-white)" }}
            >
              {customerName}
            </span>
          </p>

          <div
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {shopAccountInfo ? (
              <>
                <div>
                  <p
                    className="caption2"
                    style={{ color: "var(--color-grey-450)", marginBottom: "4px" }}
                  >
                    입금 계좌
                  </p>
                  <p className="body2" style={{ lineHeight: "1.5" }}>
                    {shopAccountInfo.bank} {shopAccountInfo.accountNumber}
                    <br />
                    예금주 : {shopAccountInfo.accountHolder}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    backgroundColor: "var(--color-purple)",
                    borderRadius: "9999px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <Copy size={18} />
                  <span className="label2">계좌 복사</span>
                </button>
              </>
            ) : (
              <p className="body2" style={{ color: "var(--color-grey-450)" }}>
                매장 계좌 정보가 등록되지 않았습니다.
              </p>
            )}
          </div>
          {copied && (
            <p
              className="caption2 mt-2 text-center"
              style={{ color: "var(--color-light-purple)" }}
            >
              계좌번호가 복사되었습니다!
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "0 20px 40px",
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "24rem",
          backgroundColor: "var(--color-black)",
        }}
      >
        <button
          onClick={handleFinalizeReservation}
          disabled={isSubmitting}
          style={{
            width: "100%",
            height: "56px",
            background:
              "linear-gradient(90deg, var(--color-purple) 0%, var(--color-light-purple) 100%)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting
            ? "처리 중..."
            : `${amountToPayNow.toLocaleString()}원 입금하기`}
        </button>
      </div>
    </div>
  );
};

export default ReservationCheck;