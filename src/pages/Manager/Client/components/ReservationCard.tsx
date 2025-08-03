import { useNavigate } from "react-router-dom";
import type { Reservation } from "../../../../types/reservations";

interface ReservationProps {
  reservation: Reservation;
}

export default function ReservationCard({ reservation }: ReservationProps) {
  const navigate = useNavigate();

  const statusColorClass =
    {
      "예약 확정": "text-[#51C879]",
      "예약 확인중": "text-[var(--color-purple)]",
      "시술 완료": "text-[var(--color-grey-450)]",
      "취소 완료": "text-[#D2636A]",
      노쇼: "text-[#D2636A]",
    }[reservation.status] || "text-[var(--color-grey-400)]";

  return (
    <div className="mt-3 items-start">
      <div
        key={reservation.reservationId}
        className="flex flex-col gap-3 px-5 py-4"
      >
        <span className={`body1 mb-1 flex justify-between ${statusColorClass}`}>
          {reservation.status}
        </span>

        <div
          onClick={(): void | Promise<void> =>
            navigate(`/reservation/${reservation.reservationId}`)
          }
          className="flex cursor-pointer gap-4"
        >
          <div className="h-25 w-25 shrink-0 rounded-[4px] bg-white"></div>
          <div className="flex h-25 w-[223px] flex-col items-start justify-between">
            <div className="flex flex-col items-start">
              <div className="body1 line-clamp-2 text-[var(--color-grey-150)]">
                {reservation.title}
              </div>
              <div className="caption1 line-clamp-1 text-[var(--color-grey-550)]">
                {reservation.shopname + " | " + reservation.name}
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="caption2 rounded-[4px] bg-[var(--color-dark-purple)] px-[6px] py-[3px] text-[var(--color-purple)]">
                  시연옵션
                </span>
                <span className="body2 text-[var(--color-grey-150)]">
                  {reservation.option}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="caption2 rounded-[4px] bg-[var(--color-dark-purple)] px-[6px] py-[3px] text-[var(--color-purple)]">
                  시연일정
                </span>
                <span className="body2 text-[var(--color-grey-150)]">
                  {reservation.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
