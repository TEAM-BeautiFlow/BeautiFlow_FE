import LeftChevronIcon from "../../../assets/icon_left-chevron.svg";
import RightChevronIcon from "../../../assets/icon_right-chevron.svg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getMonthlyReservations,
  getTodayReservationCounts,
} from "@/apis/manager_home/home";
import { useNavigate } from "react-router-dom";
import ManagerNavbar from "../../../layout/ManagerNavbar";

const TodaysReservationCard = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => (
  <div className="flex flex-col justify-between rounded-lg bg-[var(--color-grey-950)] p-4">
    <div className="flex items-center justify-between text-[var(--color-grey-450)]">
      <span className="caption1">{title}</span>
      <img src={RightChevronIcon} alt=">" className="h-4 w-4" />
    </div>
    <span className="title1 mt-2 text-[var(--color-grey-150)]">{count}</span>
  </div>
);

const Calendar = ({
  year,
  month, // 0-based
  selectedDate,
  onSelectDate,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const dates: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];
  const pad = (7 - (dates.length % 7)) % 7;
  for (let i = 0; i < pad; i += 1) dates.push(null);

  return (
    <div className="bg-[var(--color-grey-1000)] p-4">
      <div className="mb-6 flex items-center justify-center gap-3">
        <button onClick={onPrev}>
          <img src={LeftChevronIcon} alt="<" className="h-6 w-6" />
        </button>
        <h3 className="label1 text-[var(--color-grey-150)]">
          {year}년 {month + 1}월
        </h3>
        <button onClick={onNext}>
          <img src={RightChevronIcon} alt=">" className="h-6 w-6" />
        </button>
      </div>
      <div className="body2 mb-4 grid grid-cols-7 text-center text-[var(--color-grey-450)]">
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="body2 grid grid-cols-7 items-center gap-y-4 text-center">
        {dates.map((date, index) => {
          if (!date) return <div key={index} className="flex h-8" />;

          const isSelected =
            date !== null &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === date;

          const isToday =
            date !== null &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === date;
          const currentDate = new Date(year, month, date);

          const todayMidnight = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
          );
          const isPast = currentDate < todayMidnight;

          return (
            <div key={index} className="flex h-8 items-center justify-center">
              {date && (
                <button
                  onClick={() => onSelectDate(new Date(year, month, date))}
                  className={`body2 flex h-8 w-8 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-[var(--color-grey-850)] text-[var(--color-grey-250)]"
                      : isToday
                        ? "rounded-full border border-[1.5px] border-[var(--color-grey-850)]"
                        : isPast
                          ? "text-[var(--color-grey-750)]"
                          : "text-[var(--color-grey-250)]"
                  }`}
                >
                  {date}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReservationItem = ({
  status,
  time,
  customer,
  service,
  onClick,
}: {
  status: string;
  time: string;
  customer: string;
  service: string;
  onClick?: () => void;
}) => (
  <div className="border-t border-gray-800 pt-4" onClick={onClick}>
    <div className="flex items-start justify-between">
      <div>
        <p className="body1 text-[#A465FD]">{status}</p>
        <div className="my-1 flex items-center">
          <svg
            className="mr-2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="title1 text-[var(--color-grey-350)]">{time}</p>
        </div>
        <button className="caption1 flex items-center text-[var(--color-grey-450)]">
          {customer} | {service}
          <img src={RightChevronIcon} alt=">" className="ml-1 h-4 w-4" />
        </button>
      </div>
      <button className="body1 flex items-center rounded-lg bg-[var(--color-grey-850)] px-4 py-2 whitespace-nowrap text-[var(--color-grey-450)]">
        채팅
        <img src={RightChevronIcon} alt=">" className="ml-1 h-4 w-4" />
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: todayCounts } = useQuery({
    queryKey: ["todayReservationCounts"],
    queryFn: getTodayReservationCounts,
    staleTime: 1000 * 60, // 1분
  });
  const currentMonthParam = `${displayedDate.getFullYear()}-${String(
    displayedDate.getMonth() + 1,
  ).padStart(2, "0")}`; // 예: 2025-08 형식

  const { data: monthlyReservations } = useQuery({
    queryKey: ["monthlyReservations", currentMonthParam],
    queryFn: () => getMonthlyReservations(currentMonthParam, 0, 20, "string"),
    staleTime: 1000 * 60,
  });

  return (
    <div className="mx-auto min-h-screen max-w-[375px] bg-[var(--color-grey-1000)] px-4 pb-24 text-[var(--color-grey-150)]">
      <main className="flex flex-col gap-8 pt-6">
        <section>
          <h2 className="title1 mb-4">오늘의 예약</h2>
          <div className="grid grid-cols-3 gap-3">
            <TodaysReservationCard
              title="확정 대기"
              count={todayCounts?.pending ?? 0}
            />
            <TodaysReservationCard
              title="당일 완료"
              count={todayCounts?.completed ?? 0}
            />
            <TodaysReservationCard
              title="당일 취소"
              count={todayCounts?.cancelled ?? 0}
            />
          </div>
        </section>

        <section className="pt-8">
          <h2 className="title1 mb-4">전체 예약</h2>
          <Calendar
            year={displayedDate.getFullYear()}
            month={displayedDate.getMonth()}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrev={() =>
              setDisplayedDate(
                d => new Date(d.getFullYear(), d.getMonth() - 1, 1),
              )
            }
            onNext={() =>
              setDisplayedDate(
                d => new Date(d.getFullYear(), d.getMonth() + 1, 1),
              )
            }
          />
        </section>

        <section>
          {(() => {
            const y = selectedDate.getFullYear();
            const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const d = String(selectedDate.getDate()).padStart(2, "0");
            const selectedKey = `${y}-${m}-${d}`;
            const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
              selectedDate.getDay()
            ];

            const list = (monthlyReservations?.content ?? []).filter(
              item => item.date === selectedKey,
            );

            const fmt = (t?: string) => (t ?? "").slice(0, 5);

            return (
              <>
                <h3 className="body2 mb-4 text-[var(--color-grey-350)]">
                  {Number(d)}일 {dayOfWeek}
                </h3>
                <div className="space-y-4">
                  {list.map(item => (
                    <ReservationItem
                      key={item.reservationId}
                      status={item.status}
                      time={`${fmt(item.startTime)} - ${fmt(item.endTime)}`}
                      customer={item.customerName}
                      service={item.treatmentName ?? "-"}
                      onClick={() =>
                        navigate(`/manager/reservations/${item.reservationId}`)
                      }
                    />
                  ))}
                  {list.length === 0 && (
                    <p className="body2 text-[var(--color-grey-650)]">
                      예약이 없습니다.
                    </p>
                  )}
                </div>
              </>
            );
          })()}
        </section>
      </main>
      <ManagerNavbar />
    </div>
  );
};

export default HomePage;
