import type { Reservations } from "../../../../types/reservations";
import noImage from "../../../../assets/no_image.png";
interface ReservationProps {
  reservation: Reservations;
}

export default function ReservationCard({ reservation }: ReservationProps) {
  // const navigate = useNavigate();

  const groupsLabel = (
    Array.isArray(reservation.optionNames)
      ? reservation.optionNames
      : reservation.optionNames
        ? [reservation.optionNames]
        : []
  ).join(", ");

  const statusColorClass =
    {
      CONFIRMED: "text-[#51C879]",
      PENDING: "text-[var(--color-purple)]",
      COMPLETED: "text-[var(--color-grey-450)]",
      CANCELLED: "text-[#D2636A]",
      NO_SHOW: "text-[#D2636A]",
    }[reservation.status] || "text-[var(--color-grey-400)]";

  // status 설정
  const statusLabels: Record<string, string> = {
    CONFIRMED: "예약 확정",
    PENDING: "예약 확인중",
    COMPLETED: "시술 완료",
    CANCELLED: "취소 완료",
    NO_SHOW: "노쇼",
  };

  return (
    <div className="items-start">
      <div
        key={reservation.reservationId}
        className="flex flex-col gap-3 px-5 py-4"
      >
        <span className={`body1 mb-1 flex justify-between ${statusColorClass}`}>
          {statusLabels[reservation.status]}
        </span>

        <div className="flex gap-4">
          <div className="h-25 w-25 shrink-0 rounded-[4px] bg-white">
            <img
              src={reservation.imageUrl || noImage}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-25 w-[223px] flex-col items-start justify-between">
            <div className="flex flex-col items-start">
              <div className="body1 line-clamp-2 text-[var(--color-grey-150)]">
                {reservation.treatmentName}
              </div>
              <div className="caption1 line-clamp-1 text-[var(--color-grey-550)]">
                {reservation.shopName + " | " + reservation.designerName}
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="caption2 rounded-[4px] bg-[var(--color-dark-purple)] px-[6px] py-[3px] text-[var(--color-purple)]">
                  시연옵션
                </span>
                {groupsLabel && (
                  <span className="body2 line-clamp-1 w-[150px] text-[var(--color-grey-150)]">
                    {groupsLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="caption2 rounded-[4px] bg-[var(--color-dark-purple)] px-[6px] py-[3px] text-[var(--color-purple)]">
                  시연일정
                </span>
                <span className="body2 flex text-[var(--color-grey-150)]">
                  {reservation.date} {reservation.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
