import { useNavigate } from "react-router-dom";
import type { Reservation } from "../../../../types/reservations";
import axios from "axios";
import { useState } from "react";
import noImage from "../../../../assets/no_image.png";

interface ReservationProps {
  reservation: Reservation;
}

function formatOptionGroups(groups: Reservation["optionGroups"]) {
  if (!groups || groups.length === 0) return "-";
  return groups
    .map(g => {
      const items = (g.optionItems ?? [])
        .map(i => i.itemName?.trim())
        .filter(Boolean) as string[];
      return items.length ? `${g.groupName}(${items.join(", ")})` : g.groupName;
    })
    .join(", ");
}

export default function ReservationCard({ reservation }: ReservationProps) {
  const navigate = useNavigate();
  const [, setReservations] = useState<Reservation[]>([]);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // status 설정
  const statusLabels: Record<string, string> = {
    CONFIRMED: "예약 확정",
    PENDING: "예약 확인중",
    COMPLETED: "시술 완료",
    CANCELLED: "취소 완료",
    NO_SHOW: "노쇼",
  };

  // 예약 취소
  const handleCancelReservation = async (reservationId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access Token이 없습니다.");
      return;
    }
    try {
      setCancellingId(reservationId);

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/reservations/${reservationId}/cancel`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReservations(prev =>
        prev.map(r =>
          r.reservationId === reservationId ? { ...r, status: "CANCELLED" } : r,
        ),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("예약 취소 실패", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        alert("예약 취소에 실패했습니다.");
      } else {
        console.error("알 수 없는 오류", error);
      }
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mt-3 items-start">
      <div
        key={reservation.reservationId}
        className="flex flex-col gap-3 px-5 py-4"
      >
        {/* status */}
        <span
          className={`body1 mb-1 flex justify-between ${
            reservation.status === "CONFIRMED"
              ? "text-[#51C879]"
              : reservation.status === "PENDING"
                ? "text-[var(--color-purple)]"
                : reservation.status === "COMPLETED"
                  ? "text-[var(--color-grey-450)]"
                  : "text-[#D2636A]"
          } }`}
        >
          {statusLabels[reservation.status]}
          <span
            className={`body2 cursor-pointer text-[var(--color-grey-550)] ${
              reservation.status === "CONFIRMED" ||
              reservation.status === "PENDING"
                ? "block"
                : "hidden"
            } ${cancellingId === reservation.reservationId ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => {
              if (cancellingId) return;
              if (confirm("해당 예약을 취소하시겠습니까?")) {
                handleCancelReservation(reservation.reservationId);
              }
            }}
          >
            {cancellingId === reservation.reservationId
              ? "취소 중..."
              : "취소하기"}
          </span>
        </span>

        {/* 카드*/}
        <div
          onClick={(): void | Promise<void> =>
            navigate(`/reservations/${reservation.reservationId}`, {
              state: { reservation: reservation },
            })
          }
          className="flex cursor-pointer gap-4"
        >
          {/* 사진 */}
          <div className="h-25 w-25 shrink-0 rounded-[4px] bg-white">
            <img
              src={reservation.treatments[0].treatmentImageUrls[0] || noImage}
              className="h-full w-full object-cover"
            />
          </div>

          {/* 내용 */}
          <div>
            {/* 내용 윗부분 */}
            <div className="flex h-25 w-[223px] flex-col items-start justify-between">
              <div className="flex flex-col items-start">
                {/* 제목 */}
                <div className="body1 line-clamp-2 text-[var(--color-grey-150)]">
                  {reservation.treatments[0].treatmentName}{" "}
                  {reservation.treatments.length > 1 &&
                    `외 ${reservation.treatments.length - 1}개`}
                </div>
                {/* 매장명 | 시술자명 */}
                <div className="caption1 line-clamp-1 text-[var(--color-grey-550)]">
                  {reservation.shopName + " | " + reservation.designerName}
                </div>
              </div>
              {/* 내용 아래부분 */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="caption2 rounded-[4px] bg-[var(--color-dark-purple)] px-[6px] py-[3px] text-[var(--color-purple)]">
                    시술옵션
                  </span>
                  <span className="body2 line-clamp-1 w-[150px] text-[var(--color-grey-150)]">
                    {formatOptionGroups(reservation.optionGroups)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="caption2 rounded-[4px] bg-[var(--color-dark-purple)] px-[6px] py-[3px] text-[var(--color-purple)]">
                    시술일정
                  </span>
                  <span className="body2 text-[var(--color-grey-150)]">
                    {reservation.reservationDate} {reservation.startTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
