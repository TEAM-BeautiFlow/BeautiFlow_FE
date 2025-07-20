import { Outlet } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../types/reservations";

// 더미 데이터
const dummyReservations: Reservation[] = [
  {
    reservationId: 1,
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
    reservationId: 2,
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
    reservationId: 3,
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
    reservationId: 4,
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
    reservationId: 5,
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

export default function ReservationWrapper() {
  return (
    <ReservationContext.Provider value={{ reservations: dummyReservations }}>
      <Outlet />
    </ReservationContext.Provider>
  );
}
