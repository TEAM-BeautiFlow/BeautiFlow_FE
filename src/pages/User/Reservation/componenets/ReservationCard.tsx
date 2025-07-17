type Reservation = {
  id: number;
  status: string;
  title: string;
  name: string;
  address: string;
  date: string;
};

type Props = {
  reservation: Reservation;
};

export default function ReservationCard({ reservation }: Props) {
  return (
    <div className="mt-4 flex flex-col">
      <div
        key={reservation.id}
        className="flex h-[177px] flex-col gap-3 px-5 py-4"
      >
        <span
          className={`body1 mb-1 ${
            reservation.status === "예약 확정"
              ? "text-[#51C879]"
              : "text-[var(--color-grey-450)]"
          }`}
        >
          {reservation.status}
        </span>
        <div className="flex h-[112px] gap-4">
          {/* 왼쪽 이미지 */}
          <div className="h-25 w-25 shrink-0 rounded-[4px] bg-[var(--color-grey-450)]"></div>

          {/* 오른쪽 내용 */}
          <div className="flex flex-1 flex-col justify-between">
            {/* 제목 */}
            <div className="body1 line-clamp-2 text-[var(--color-grey-150)]">
              {reservation.title}
            </div>

            {/* 주소 */}
            <div className="caption2 line-clamp-2 text-[var(--color-grey-650)]">
              {reservation.name + " | " + reservation.address}
            </div>

            {/* 태그 + 날짜 */}
            <div className="mt-2 flex h-[26px] items-center gap-2">
              <span className="caption2 rounded-[8px] bg-[var(--color-dark-purple)] px-2 py-1 text-[var(--color-purple)]">
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
  );
}
