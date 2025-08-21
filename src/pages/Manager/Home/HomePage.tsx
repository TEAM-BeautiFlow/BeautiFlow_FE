import LeftChevronIcon from "../../../assets/icon_left-chevron.svg";
import RightChevronIcon from "../../../assets/icon_right-chevron.svg";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  getMonthlyReservations,
  getTodayReservationCounts,
} from "@/apis/manager_home/home";
import { useNavigate } from "react-router-dom";
import ManagerNavbar from "../../../layout/ManagerNavbar";
import Header from "@/layout/Header";
import axios from "axios";
import { getUserInfo } from "@/apis/mypage/mypage";

const TodaysReservationCard = ({
  title,
  count,
  onClick,
}: {
  title: string;
  count: number;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col justify-between rounded-lg bg-[var(--color-grey-950)] p-4 text-left"
  >
    <div className="flex items-center justify-between text-[var(--color-grey-450)]">
      <span className="caption1">{title}</span>
      <img src={RightChevronIcon} alt=">" className="h-4 w-4" />
    </div>
    <span className="title1 mt-2 text-[var(--color-grey-150)]">{count}</span>
  </button>
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
                        ? "rounded-full border-[1.5px] border-[var(--color-grey-850)]"
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
  onChat,
}: {
  status: string;
  time: string;
  customerId: number;
  customer: string;
  service: string;
  onClick?: () => void;
  onChat?: () => void;
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
      <button
        onClick={onChat}
        className="body1 flex items-center gap-1 rounded-[8px] bg-[var(--color-grey-850)] py-[6px] pr-2 pl-3 whitespace-nowrap text-[var(--color-grey-450)]"
      >
        채팅
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_3578_588)">
            <path
              d="M3.21379 2.72888C3.5142 2.68275 3.76174 2.76777 3.85246 2.7992C3.9815 2.84392 4.12899 2.9104 4.24211 2.96131L12.6005 6.72302C12.7109 6.77268 12.8567 6.83739 12.9745 6.90369C13.0711 6.95803 13.3491 7.11707 13.5116 7.44568C13.6843 7.79484 13.6843 8.20492 13.5116 8.55408C13.3491 8.88257 13.071 9.04175 12.9745 9.09607C12.8567 9.16237 12.7108 9.22709 12.6005 9.27673L4.24504 13.0365C4.13147 13.0876 3.98366 13.1548 3.85441 13.1996C3.75089 13.2355 3.44173 13.3417 3.08293 13.2416C2.70427 13.1359 2.39771 12.8578 2.2548 12.4916C2.11947 12.1447 2.19327 11.8268 2.21867 11.7201C2.25033 11.5871 2.30316 11.4339 2.34269 11.3158L3.44621 8.01697L2.33879 4.67908C2.29972 4.56138 2.24702 4.4086 2.21574 4.27576C2.19062 4.16897 2.11815 3.85133 2.25383 3.50525C2.39719 3.13971 2.7037 2.86252 3.08195 2.7572L3.21379 2.72888ZM3.49992 7.24939V8.74939H6.99992C7.41413 8.74939 7.74992 8.4136 7.74992 7.99939C7.74975 7.58533 7.41403 7.24939 6.99992 7.24939H3.49992Z"
              fill="#BDBEBD"
            />
          </g>
          <defs>
            <clipPath id="clip0_3578_588">
              <rect
                width="12"
                height="12"
                fill="white"
                transform="translate(2 2)"
              />
            </clipPath>
          </defs>
        </svg>
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

  const userIdRef = useRef<number | null>(null);
  const shopIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const userInfo = await getUserInfo();
        if (!cancelled) {
          userIdRef.current = userInfo.id;
          shopIdRef.current = userInfo.shopMembers?.[0]?.shopId ?? null;
          if (shopIdRef.current) {
            localStorage.setItem("shopId", String(shopIdRef.current));
          }
        }
      } catch (e) {
        console.error("failed to load user info", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 채팅방 입장
  const handleCreateRoom = async (customerId: number, customerName: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const shopId = shopIdRef.current;
      const designerId = userIdRef.current;

      if (!token || !designerId || !shopId) {
        console.error("정보가 부족합니다.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/rooms`,
        { shopId, customerId, designerId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const roomId = response.data.data.roomId;
      navigate(`/chat/rooms/${roomId}`, {
        state: {
          customerId,
          name: customerName,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("채팅방 생성 실패", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[375px] bg-[var(--color-grey-1000)] pb-24 text-[var(--color-grey-150)]">
      <Header />

      <main className="flex flex-col gap-8 px-4 pt-6">
        <section>
          <h2 className="title1 mb-4">오늘의 예약</h2>
          <div className="grid grid-cols-3 gap-3">
            <TodaysReservationCard
              title="확정 대기"
              count={todayCounts?.pending ?? 0}
              onClick={() => navigate("/manager/home/today/pending")}
            />
            <TodaysReservationCard
              title="당일 완료"
              count={todayCounts?.completed ?? 0}
              onClick={() => navigate("/manager/home/today/completed")}
            />
            <TodaysReservationCard
              title="당일 취소"
              count={todayCounts?.cancelled ?? 0}
              onClick={() => navigate("/manager/home/today/cancelled")}
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
                      customerId={item.customerId}
                      customer={item.customerName}
                      service={item.treatmentName ?? "-"}
                      onClick={() =>
                        navigate(`/manager/reservations/${item.reservationId}`)
                      }
                      onChat={() =>
                        handleCreateRoom(item.customerId, item.customerName)
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
