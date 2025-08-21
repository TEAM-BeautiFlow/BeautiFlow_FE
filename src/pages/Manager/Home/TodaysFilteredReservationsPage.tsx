import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/layout/Header";
import ManagerNavbar from "@/layout/ManagerNavbar";
import RightChevronIcon from "@/assets/icon_right-chevron.svg";
import LeftChevronIcon from "@/assets/icon_left-chevron.svg";
import {
  getMonthlyReservations,
  getTodayReservationCounts,
} from "@/apis/manager_home/home";

type FilterKey = "pending" | "completed" | "cancelled";

const filterLabel: Record<FilterKey, string> = {
  pending: "확정 대기",
  completed: "당일 완료",
  cancelled: "당일 취소",
};

const statusGroups: Record<FilterKey, string[]> = {
  pending: ["PENDING", "CONFIRMED"],
  completed: ["COMPLETED"],
  cancelled: ["CANCELLED", "NO_SHOW"],
};

function ReservationRow({
  status,
  time,
  customer,
  service,
  onClick,
  onChat,
}: {
  status: string;
  time: string;
  customer: string;
  service: string;
  onClick: () => void;
  onChat?: () => void;
}) {
  return (
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
            <g clipPath="url(#clip0)">
              <path
                d="M3.21379 2.72888C3.5142 2.68275 3.76174 2.76777 3.85246 2.7992C3.9815 2.84392 4.12899 2.9104 4.24211 2.96131L12.6005 6.72302C12.7109 6.77268 12.8567 6.83739 12.9745 6.90369C13.0711 6.95803 13.3491 7.11707 13.5116 7.44568C13.6843 7.79484 13.6843 8.20492 13.5116 8.55408C13.3491 8.88257 13.071 9.04175 12.9745 9.09607C12.8567 9.16237 12.7108 9.22709 12.6005 9.27673L4.24504 13.0365C4.13147 13.0876 3.98366 13.1548 3.85441 13.1996C3.75089 13.2355 3.44173 13.3417 3.08293 13.2416C2.70427 13.1359 2.39771 12.8578 2.2548 12.4916C2.11947 12.1447 2.19327 11.8268 2.21867 11.7201C2.25033 11.5871 2.30316 11.4339 2.34269 11.3158L3.44621 8.01697L2.33879 4.67908C2.29972 4.56138 2.24702 4.4086 2.21574 4.27576C2.19062 4.16897 2.11815 3.85133 2.25383 3.50525C2.39719 3.13971 2.7037 2.86252 3.08195 2.7572L3.21379 2.72888ZM3.49992 7.24939V8.74939H6.99992C7.41413 8.74939 7.74992 8.4136 7.74992 7.99939C7.74975 7.58533 7.41403 7.24939 6.99992 7.24939H3.49992Z"
                fill="#BDBEBD"
              />
            </g>
            <defs>
              <clipPath id="clip0">
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
}

export default function TodaysFilteredReservationsPage() {
  const navigate = useNavigate();
  const { filter } = useParams<{ filter: FilterKey }>();

  const today = new Date();
  const monthParam = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const { data: counts } = useQuery({
    queryKey: ["todayReservationCounts"],
    queryFn: getTodayReservationCounts,
    staleTime: 60 * 1000,
  });

  const { data: monthlyReservations } = useQuery({
    queryKey: ["monthlyReservations", monthParam],
    queryFn: () => getMonthlyReservations(monthParam, 0, 200, "string"),
    staleTime: 60 * 1000,
  });

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const activeFilter: FilterKey = (filter as FilterKey) || "pending";
  const headerCount = counts?.[activeFilter] ?? 0;

  const list = useMemo(() => {
    const statuses = statusGroups[activeFilter];
    return (monthlyReservations?.content ?? [])
      .filter(r => r.date === todayKey)
      .filter(r => statuses.includes(r.status));
  }, [monthlyReservations, activeFilter, todayKey]);

  const fmt = (t?: string) => (t ?? "").slice(0, 5);

  return (
    <div className="mx-auto min-h-screen max-w-[375px] bg-[var(--color-grey-1000)] pb-24 text-[var(--color-grey-150)]">
      <Header />
      <main className="flex flex-col gap-6 px-4 pt-6">
        <section>
          <button onClick={() => navigate(-1)} className="-ml-1 p-1">
            <img src={LeftChevronIcon} alt="<" className="h-6 w-6" />
          </button>
        </section>
        <section>
          <h2 className="title1 mb-2">{filterLabel[activeFilter]}</h2>
          <p className="body2 text-[var(--color-grey-450)]">
            오늘 · {headerCount}건
          </p>
        </section>

        <nav className="flex gap-2">
          {(["pending", "completed", "cancelled"] as FilterKey[]).map(key => (
            <button
              key={key}
              onClick={() => navigate(`/manager/home/today/${key}`)}
              className={`caption1 rounded-full px-3 py-1 ${
                key === activeFilter
                  ? "bg-[var(--color-grey-850)] text-[var(--color-grey-150)]"
                  : "bg-[var(--color-grey-900)] text-[var(--color-grey-500)]"
              }`}
            >
              {filterLabel[key]}
            </button>
          ))}
        </nav>

        <section>
          <div className="space-y-4">
            {list.map(item => (
              <ReservationRow
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
                해당 항목이 없습니다.
              </p>
            )}
          </div>
        </section>
      </main>
      <ManagerNavbar />
    </div>
  );
}
