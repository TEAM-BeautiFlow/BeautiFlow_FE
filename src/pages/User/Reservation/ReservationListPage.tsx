import { useEffect, useState } from "react";
import { useReservationContext } from "../../../context/ReservationContext";
import ReservationTabBar from "./componenets/ReservationTabBar";
import ReservationCard from "./componenets/ReservationCard";
import UserNavbar from "../../../layout/UserNavbar";
import Header from "@/layout/Header";
import { api } from "@/apis/axiosInstance";

export default function ReservationListPage() {
  const [activeTab, setActiveTab] = useState("예정");
  const { reservations } = useReservationContext();
  const [items, setItems] = useState(reservations);

  const filteredReservations = reservations.filter(r => {
    if (activeTab === "예정") {
      return r.status === "CONFIRMED" || r.status === "PENDING";
    } else if (activeTab === "완료") {
      return r.status === "COMPLETED";
    } else if (activeTab === "취소") {
      return r.status === "CANCELLED" || r.status === "NO_SHOW";
    }
    return false;
  });

  // + 탭 변경 시 백엔드에서 status별로 조회( CSV 미지원 가정: 다중 상태는 개별 호출 후 병합 )
  useEffect(() => {
    const controller = new AbortController();

    const statuses =
      activeTab === "예정"
        ? ["CONFIRMED", "PENDING"]
        : activeTab === "완료"
          ? ["COMPLETED"]
          : ["CANCELLED", "NO_SHOW"];

    (async () => {
      try {
        const results = await Promise.allSettled(
          statuses.map(s =>
            api.get("/reservations/my-reservation", {
              params: { status: s },
              signal: controller.signal, // 탭 전환/언마운트 시 취소
            }),
          ),
        );
        const parts = results
          .filter(
            (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled",
          )
          .map(r => r.value)
          .map(r => (Array.isArray(r.data?.data) ? r.data.data : []));
        const merged = parts.flat();

        // 중복 제거 (reservationId 기준)
        const uniq = Array.from(
          new Map(merged.map(r => [r.reservationId, r])).values(),
        );
        uniq.sort((a, b) =>
          `${a.reservationDate ?? ""} ${a.startTime ?? ""}`.localeCompare(
            `${b.reservationDate ?? ""} ${b.startTime ?? ""}`,
          ),
        );

        setItems(uniq);
      } catch (e) {
        // 실패 시 기존 클라 필터 결과로 폴백
        setItems(filteredReservations);
        console.error("예약 조회 실패:", e);
      }
    })();

    return () => {
      controller.abort(); // 진행 중 요청 취소
    };
    // filteredReservations는 폴백용이므로 의존성에 넣지 않음
  }, [activeTab]);

  return (
    <div className="mx-auto h-screen w-[375px] bg-[var(--color-grey-1000)]">
      <div className="">
        <Header />
        <ReservationTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-4 flex flex-col">
        {(items.length ? items : filteredReservations).map(reservation => (
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
