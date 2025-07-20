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
  if (!context) {
    throw new Error("ReservationContext is not provided");
  }
  return context;
};
