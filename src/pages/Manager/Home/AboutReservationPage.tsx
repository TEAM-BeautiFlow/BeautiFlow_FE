import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReservationDetail,
  updateReservationStatus,
} from "@/apis/manager_home/home";

interface ReservationDetailPageProps {
  onBack?: () => void;
  onClose?: () => void;
  onStatusChange?: () => void;
  onChat?: () => void;
}

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
  currentStatus: string;
}

function StatusModal({
  isOpen,
  onClose,
  onStatusSelect,
  currentStatus,
}: StatusModalProps) {
  const statusOptions = [
    { id: "확정 대기", label: "확정 대기" },
    { id: "예약 확정", label: "예약 확정" },
    { id: "취소", label: "취소" },
    { id: "노쇼", label: "노쇼" },
    { id: "시술 완료", label: "시술 완료" },
  ];

  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-end justify-center duration-200">
      {/* Overlay */}
      <div
        className="absolute inset-0 mx-auto w-[375px] justify-center bg-[#0c0d1199] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative mx-auto w-full max-w-[375px] transform rounded-t-lg bg-[#3a3a3a] pb-6 shadow-2xl transition-transform duration-300 ease-out">
        <div className="px-5 py-6">
          <h3 className="title1 mb-6 text-[#fafafa]">활성화 상태</h3>

          <div className="space-y-4">
            {statusOptions.map(option => (
              <button
                key={option.id}
                onClick={() => onStatusSelect(option.id)}
                className="flex w-full items-center space-x-3 py-1"
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  {currentStatus === option.id ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#a83dff" />
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-[#6e6e6e]" />
                  )}
                </div>
                <span className="body2 text-[#f3f3f3]">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <button
            onClick={onClose}
            className="mt-6 w-full rounded bg-[#a83dff] py-4 text-base font-semibold text-[#f3f3f3]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AboutReservationPage({
  onBack,
  onStatusChange,
}: ReservationDetailPageProps = {}) {
  const navigate = useNavigate();
  const params = useParams();
  const reservationId = useMemo(
    () => Number(params.reservationId),
    [params.reservationId],
  );
  const queryClient = useQueryClient();
  const { data: detail } = useQuery({
    queryKey: ["reservationDetail", reservationId],
    queryFn: () => getReservationDetail(reservationId),
    enabled: Number.isFinite(reservationId),
  });
  const formatWon = (num?: number) =>
    typeof num === "number" ? num.toLocaleString("ko-KR") + "원" : "-";
  const formatTime = (t?: string) => (t ?? "").slice(0, 5);
  const statusLabel: Record<string, string> = {
    CONFIRMED: "예약 확정",
    PENDING: "확정 대기",
    CANCELLED: "취소",
    NO_SHOW: "노쇼",
    COMPLETED: "시술 완료",
  };
  const [currentStatus, setCurrentStatus] = useState("확정 대기");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // 이전 페이지로 이동
    }
  };

  const handleStatusChange = () => {
    setIsStatusModalOpen(true);
    onStatusChange?.();
  };

  const handleStatusSelect = (status: string) => {
    setCurrentStatus(status);
  };

  // 확인 버튼에서 닫도록 변경하여 별도 close 핸들러 제거

  const handleStatusSubmit = async () => {
    if (!Number.isFinite(reservationId)) return;
    try {
      const serverKey: Record<string, string> = {
        "확정 대기": "PENDING",
        "예약 확정": "CONFIRMED",
        취소: "CANCELLED",
        노쇼: "NO_SHOW",
        "시술 완료": "COMPLETED",
      };
      const next = serverKey[currentStatus] ?? currentStatus;
      await updateReservationStatus(reservationId, next);
      await queryClient.invalidateQueries({
        queryKey: ["reservationDetail", reservationId],
      });
      // 홈 화면 관련 데이터도 함께 무효화하여 돌아갔을 때 즉시 최신화되도록 처리
      await queryClient.invalidateQueries({
        queryKey: ["todayReservationCounts"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["monthlyReservations"],
      });
      setIsStatusModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("상태 변경에 실패했습니다.");
    }
  };
  return (
    <>
      <div className="mx-auto min-h-screen w-[375px] bg-[#1a1a1a] pb-[87px] text-white">
        {/* Header */}
        <div className="relative flex h-[60px] items-center justify-between px-5 py-4">
          <button onClick={handleBack} className="h-6 w-6">
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              <path
                d="M15 18L9 12L15 6"
                stroke="#f3f3f3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 transform text-base font-semibold text-[#f3f3f3]">
            예약 세부 내역
          </h1>

          <div className="h-6 w-6"></div>
        </div>

        {/* Status Section */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h2
              className={`title1 ${
                detail?.status === "CONFIRMED"
                  ? "text-[#51C879]"
                  : detail?.status === "PENDING"
                    ? "text-[var(--color-purple)]"
                    : detail?.status === "COMPLETED"
                      ? "text-[var(--color-grey-450)]"
                      : "text-[#D2636A]"
              }`}
            >
              {detail?.status
                ? (statusLabel[detail.status] ?? detail.status)
                : currentStatus}
            </h2>
            <p className="body2 mt-1 leading-[21px] text-[var(--color-grey-550)]">
              예약금 입금 여부를 확인하고
              <br />
              예약 확정 상태로 변경해주세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStatusChange}
              className="body2 rounded-[8px] border border-[var(--color-grey-650)] px-4 py-2 text-[var(--color-grey-150)]"
            >
              상태 변경
            </button>
          </div>
        </div>

        {/* Service Info Section */}
        <div className="px-5 py-4">
          <h3 className="title2 mb-4 text-[#f3f3f3]">시술 정보</h3>
          <div className="space-y-3 rounded-[4px] bg-[#3a3a3a] p-4">
            <div>
              <h4 className="title1 text-[#e8e8e8]">
                {detail?.treatmentNames?.join(", ") || "-"}
              </h4>
              <p className="body2 mt-1 text-[#bdbebd]">
                {detail?.date} {formatTime(detail?.startTime)} -{" "}
                {formatTime(detail?.endTime)}
                {detail?.durationText ? ` | ${detail.durationText}` : ""}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="body2 text-[#8e8e8e]">옵션</span>
                <span className="body1 text-[#f3f3f3]">
                  {detail?.optionNames?.length
                    ? detail.optionNames.join(", ")
                    : "없음"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info Section */}
        <div className="px-5 py-4">
          <h3 className="title2 mb-2 text-[#f3f3f3]">결제 정보</h3>
          <p className="body2 mb-4 leading-[21px] text-[#8e8e8e]">
            매장에서 결제할 금액은
            <br />
            전체 시술 금액에서 예약금을 제외한 값이에요.
          </p>

          <div className="space-y-4 rounded-[4px] bg-[#3a3a3a] p-4">
            <div className="flex items-center justify-between">
              <span className="label2 text-[#bdbebd]">받을 예약금</span>
              <span className="label1 text-[#a83dff]">
                {formatWon(detail?.paymentInfo?.depositAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label2 text-[#bdbebd]">
                매장에서 결제할 금액
              </span>
              <span className="label1 text-[#f3f3f3]">
                {formatWon(detail?.paymentInfo?.shopPayAmount)}
              </span>
            </div>
          </div>
        </div>
        {/* Customer Info Section */}
        <div className="px-5 py-4">
          <h3 className="title2 mb-4 text-[#f3f3f3]">고객 정보</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#3a3a3a]"></div>
              <div>
                <span className="label1 text-[#f3f3f3]">
                  {detail?.customerName ?? "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Photos */}
          <div className="mt-4 flex space-x-2">
            {(detail?.imageUrls ?? []).slice(0, 5).map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`style-${idx}`}
                className="h-20 w-20 rounded object-cover"
              />
            ))}
          </div>

          {/* Customer Message */}
          <div className="mt-4 rounded bg-[#262626] p-4">
            <p className="body2 text-[#f3f3f3]">
              {detail?.requestNotes || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleStatusSubmit}
        onStatusSelect={handleStatusSelect}
        currentStatus={currentStatus}
      />
    </>
  );
}
