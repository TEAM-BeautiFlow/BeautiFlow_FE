import { useState } from "react";
import { useReservationContext } from "../../../context/ReservationContext";
import ReservationTabBar from "./componenets/ReservationTabBar";
import ReservationCard from "./componenets/ReservationCard";
import UserNavbar from "../../../layout/UserNavbar";

export default function ReservationListPage() {
  const [activeTab, setActiveTab] = useState("예정");
  const { reservations } = useReservationContext();

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
          <ReservationCard
            key={reservation.reservationId}
            reservation={reservation}
          />
        ))}
      </div>

      <UserNavbar />
    </div>
  );
}
