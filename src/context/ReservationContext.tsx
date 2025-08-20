import { createContext, useContext } from "react";
import type { Reservation } from "../types/reservations";

type ReservationContextType = {
  reservations: Reservation[];
};

export const ReservationContext = createContext<ReservationContextType | null>(
  null,
);

export const useReservationContext = () => {
  const context = useContext(ReservationContext);
  // 컨텍스트 미제공 시에도 페이지가 죽지 않도록 폴백 반환
  return context ?? { reservations: [] };
};
