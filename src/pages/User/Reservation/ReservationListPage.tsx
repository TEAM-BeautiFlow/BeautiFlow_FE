import { useState } from "react";
import UserNavbar from "../../../layout/UserNavbar";
import ReservationCard from "./componenets/ReservationCard";
import ReservationTabBar from "./componenets/ReservationTabBar";

const reservations = [
  {
    id: 1,
    status: "예약 확정",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.07.06 · 오후 1시",
  },
  {
    id: 2,
    status: "예약 확인중",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.08.01 · 오후 3시",
  },
  {
    id: 3,
    status: "시술 완료",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.07.06 · 오후 1시",
  },
  {
    id: 4,
    status: "취소 완료",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.07.06 · 오후 1시",
  },
  {
    id: 5,
    status: "노쇼",
    title: "이달의 아트",
    shopname: "매장명",
    name: "시술자명",
    option: "없음",
    address:
      "짧은 주소 (AK플라자 5호)\n매장 주소 또한 최대 2줄을 유지합니다. (36px)",
    date: "2025.07.06 · 오후 1시",
  },
];

export default function ReservationListPage() {
  const [activeTab, setActiveTab] = useState("예정");

  const filteredReservations = reservations.filter(r => {
    if (activeTab === "예정") {
      return r.status === "예약 확정" || r.status === "예약 확인중";
    } else if (activeTab === "완료") {
      return r.status === "시술 완료";
    } else if (activeTab === "취소") {
      return r.status === "취소 완료" || r.status === "노쇼";
    }
  });
  return (
    <div className="h-screen w-[375px] bg-[var(--color-grey-1000)]">
      <div className="">
        <h1 className="mx-1 h-[101px] px-4 pt-18 pb-10 text-2xl font-bold tracking-tighter text-[var(--color-purple)] transition-colors">
          BEAUTIFLOW
        </h1>
        <ReservationTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-4 flex flex-col">
        {filteredReservations.map(reservation => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
      <UserNavbar />
    </div>
  );
}
