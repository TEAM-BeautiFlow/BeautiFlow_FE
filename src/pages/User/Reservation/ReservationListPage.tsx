import { useState } from "react";
import { useReservationContext } from "../../../context/ReservationContext";
import ReservationTabBar from "./componenets/ReservationTabBar";
import ReservationCard from "./componenets/ReservationCard";
import UserNavbar from "../../../layout/UserNavbar";
import Header from "@/layout/Header";

export default function ReservationListPage() {
  const [activeTab, setActiveTab] = useState("예정");
  const { reservations } = useReservationContext();

  const filteredReservations = reservations.filter(r => {
    if (activeTab === "예정") {
      return r.status === "CONFIRMED" || r.status === "PENDING";
    } else if (activeTab === "완료") {
      return r.status === "COMPLETED";
    } else if (activeTab === "취소") {
      return r.status === "CANCELLED" || r.status === "NO_SHOW";
    }
  });

  return (
    <div className="mx-auto h-screen w-[375px] bg-[var(--color-grey-1000)]">
      <div className="">
        <Header />
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
